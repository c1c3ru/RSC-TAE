import React, { createContext, useContext, useState, useEffect } from "react";
import { competencyItems as itemsData } from "../data/competencyItems"; // Se seus itens de competência ainda são dados locais
import supabase from "../utils/supabaseClient"; // Importa a instância do Supabase
import { useAuth } from "./AuthContext"; // Importa o hook de autenticação para obter o usuário logado

// Cria o contexto de Competência
const CompetencyContext = createContext();

// Hook personalizado para usar o contexto de competência
export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error("useCompetency must be used within a CompetencyProvider");
  }
  return context;
};

// Componente Provedor de Competência
export const CompetencyProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth(); // Obtém o usuário atual e o estado de carregamento da autenticação
  const [competencyItems, setCompetencyItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState([0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true); // Estado de carregamento para as atividades
  const [error, setError] = useState(null); // Novo estado para erros

  // Define a meta para a próxima pontuação de progressão
  const nextProgressionScore = 100;

  // Efeito para carregar itens de competência (se forem locais) e atividades do Supabase
  useEffect(() => {
    // Carrega itens de competência de dados locais (se ainda não estiverem no Supabase)
    setCompetencyItems(itemsData);

    const fetchActivities = async () => {
      if (!currentUser || authLoading) {
        // Não tenta buscar atividades se não houver usuário logado ou se a autenticação ainda estiver carregando
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null); // Limpa erros anteriores

      try {
        // CORREÇÃO: String de seleção limpa, sem comentários ou caracteres extras.
        // As colunas dentro de 'competences:competence_id' são as colunas da tabela 'competences'.
        const { data, error } = await supabase
          .from("user_rsc")
          .select(
            `
    id,
    user_id,
    competence_id,
    value,
    date_awarded,
    status,
    observacoes,
    data_atualizacao,
    documents_urls,
    data_inicio,
    data_fim,
    quantidade,
    descricao,
    competence:user_rsc_competence_id_fkey (
      id,
      category,
      title,
      type,
      points_per_unit,
      max_points,
      unit,
      validation_rules
    )
  `
          )
          .eq("user_id", currentUser.id);
        // Filtra atividades pelo ID do usuário logado

        if (error) {
          console.error("Erro ao buscar atividades:", error.message);
          setError(`Erro ao buscar atividades: "${error.message}"`);
          setActivities([]); // Limpa atividades em caso de erro
          return;
        }

        // Mapeia os dados do Supabase para o formato esperado pelo seu front-end
        const mappedActivities = data.map((dbActivity) => ({
          id: dbActivity.id,
          userId: dbActivity.user_id, // Adicionado para clareza
          itemCompetenciaId: dbActivity.competence_id, // Usa competence_id do Supabase
          dataInicio: dbActivity.data_inicio,
          dataFim: dbActivity.data_fim,
          quantidade: dbActivity.quantidade,
          descricao: dbActivity.descricao,
          pontuacao: dbActivity.value, // Usa 'value' do Supabase como 'pontuacao'
          status: dbActivity.status,
          observacoes: dbActivity.observacoes,
          dataRegistro: dbActivity.date_awarded, // Usa 'date_awarded' do Supabase como 'dataRegistro'
          dataAtualizacao: dbActivity.data_atualizacao,
          documents: dbActivity.documents_urls || [], // Garante que é um array, renomeado para 'documents'
          // Os detalhes do item de competência vêm do join 'competences'
          itemCompetenciaDetails: dbActivity.competences
            ? {
                // Mapeia as colunas da tabela 'competences' para o formato local
                id: dbActivity.competences.id,
                categoria: dbActivity.competences.category,
                titulo: dbActivity.competences.title,
                tipoCalculo: dbActivity.competences.type,
                valorPonto: dbActivity.competences.points_per_unit,
                pontuacaoMaxima: dbActivity.competences.max_points,
                unidadeMedida: dbActivity.competences.unit,
                validationRules: dbActivity.competences.validation_rules, // Adicionado validation_rules
              }
            : null, // Se o join falhar ou não houver correspondência
        }));

        setActivities(mappedActivities);
      } catch (err) {
        console.error("Erro inesperado ao buscar atividades:", err);
        setError(`Erro inesperado ao buscar atividades: "${err.message}"`);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser, authLoading]); // Re-executa quando o usuário muda ou o estado de autenticação muda

  // Calcula pontuação total e por categoria sempre que as atividades ou itens de competência mudam
  useEffect(() => {
    if (!activities.length) {
      setTotalScore(0);
      setCategoryScores([0, 0, 0, 0, 0, 0]);
      return;
    }

    const catScores = [0, 0, 0, 0, 0, 0];
    let total = 0;

    activities.forEach((activity) => {
      if (activity.status !== "rejeitada") {
        total += activity.pontuacao;

        // Prioriza os detalhes do item de competência vindos do join
        // Se o join não trouxe dados, tenta usar os dados locais (itemsData)
        const item =
          activity.itemCompetenciaDetails ||
          competencyItems.find(
            (item) => item.id === activity.itemCompetenciaId
          );

        if (item) {
          // Mapeamento de categoria string para índice numérico (exemplo, ajuste conforme suas categorias)
          const categoryMap = {
            Administrativas: 1,
            Experiência: 2,
            Formação: 3,
            Produção: 4,
            Eventos: 5,
            Ensino: 6,
          };

          const categoryValue = item.categoria || categoryMap[item.category]; // Tenta pegar do join ou do mapeamento
          const categoryIndex =
            (categoryValue ? parseInt(categoryValue) : 0) - 1; // Converte para int e subtrai 1

          if (categoryIndex >= 0 && categoryIndex < catScores.length) {
            catScores[categoryIndex] += activity.pontuacao;
          } else {
            console.warn(
              `Categoria inválida ou não mapeada para o item ${item.id}:`,
              item.categoria || item.category
            );
          }
        }
      }
    });

    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities, competencyItems]); // Depende de activities e competencyItems

  // Registra uma nova atividade no Supabase
  const registerActivity = async (activityData) => {
    if (!currentUser) {
      setError("Usuário não autenticado para registrar atividade.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Mapeia o array de objetos de documentos para um array de URLs (ou o formato que documents_urls espera)
      // Se documents_urls for JSONB, você pode enviar o array de objetos diretamente.
      // Se for TEXT[], você pode enviar apenas as URLs: activityData.documents.map(doc => doc.url)
      const documentUrlsToStore = activityData.documents.map((doc) => ({
        id: doc.id,
        url: doc.publicURL, // Usar publicURL do Supabase Storage
        name: doc.nome,
        storagePath: doc.storagePath, // Armazena o caminho do Storage para futuras exclusões
      }));

      // Adapta activityData para o formato da sua tabela 'user_rsc' no Supabase
      const { data, error } = await supabase.from("user_rsc").insert({
        user_id: currentUser.id,
        competence_id: activityData.itemCompetenciaId, // Usa competence_id
        data_inicio: activityData.dataInicio,
        data_fim: activityData.dataFim,
        quantidade: activityData.quantidade,
        descricao: activityData.descricao,
        value: activityData.pontuacao, // Coluna 'value' no Supabase
        status: activityData.status,
        observacoes: activityData.observacoes,
        date_awarded: new Date().toISOString(), // Coluna 'date_awarded' no Supabase
        data_atualizacao: new Date().toISOString(),
        documents_urls: documentUrlsToStore, // Agora armazena as URLs reais dos documentos
      }).select(`
            id,
            user_id,
            competence_id,
            value,
            date_awarded,
            status,
            observacoes,
            data_atualizacao,
            documents_urls,
            data_inicio,
            data_fim,
            quantidade,
            descricao,
            competences:competence_id (
              id,
              category,
              title,
              type,
              points_per_unit,
              max_points,
              unit,
              validation_rules
            )
        `); // Retorna os dados inseridos com join

      if (error) {
        throw error;
      }

      // Mapeia o dado inserido de volta para o formato do front-end
      const newMappedActivity = {
        id: data[0].id,
        userId: data[0].user_id,
        itemCompetenciaId: data[0].competence_id,
        dataInicio: data[0].data_inicio,
        dataFim: data[0].data_fim,
        quantidade: data[0].quantidade,
        descricao: data[0].descricao,
        pontuacao: data[0].value,
        status: data[0].status,
        observacoes: data[0].observacoes,
        dataRegistro: data[0].date_awarded,
        dataAtualizacao: data[0].data_atualizacao,
        documents: data[0].documents_urls || [],
        itemCompetenciaDetails: data[0].competences
          ? {
              id: data[0].competences.id,
              categoria: data[0].competences.category,
              titulo: data[0].competences.title,
              tipoCalculo: data[0].competences.type,
              valorPonto: data[0].competences.points_per_unit,
              pontuacaoMaxima: data[0].competences.max_points,
              unidadeMedida: data[0].competences.unit,
              validationRules: data[0].competences.validation_rules,
            }
          : null,
      };

      setActivities((prev) => [...prev, newMappedActivity]);
      return newMappedActivity;
    } catch (err) {
      console.error("Erro ao registrar atividade:", err.message);
      setError(`Erro ao registrar atividade: "${err.message}"`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualiza o status de uma atividade no Supabase
  const updateActivityStatus = async (activityId, status, comments = "") => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_rsc")
        .update({
          status: status,
          observacoes: comments,
          data_atualizacao: new Date().toISOString(),
        })
        .eq("id", activityId).select(`
            id,
            user_id,
            competence_id,
            value,
            date_awarded,
            status,
            observacoes,
            data_atualizacao,
            documents_urls,
            data_inicio,
            data_fim,
            quantidade,
            descricao,
            competences:competence_id (
              id,
              category,
              title,
              type,
              points_per_unit,
              max_points,
              unit,
              validation_rules
            )
        `);

      if (error) {
        throw error;
      }

      // Mapeia o dado atualizado de volta para o formato do front-end
      const updatedMappedActivity = {
        id: data[0].id,
        userId: data[0].user_id,
        itemCompetenciaId: data[0].competence_id,
        dataInicio: data[0].data_inicio,
        dataFim: data[0].data_fim,
        quantidade: data[0].quantidade,
        descricao: data[0].descricao,
        pontuacao: data[0].value,
        status: data[0].status,
        observacoes: data[0].observacoes,
        dataRegistro: data[0].date_awarded,
        dataAtualizacao: data[0].data_atualizacao,
        documents: data[0].documents_urls || [],
        itemCompetenciaDetails: data[0].competences
          ? {
              id: data[0].competences.id,
              categoria: data[0].competences.category,
              titulo: data[0].competences.title,
              tipoCalculo: data[0].competences.type,
              valorPonto: data[0].competences.points_per_unit,
              pontuacaoMaxima: data[0].competences.max_points,
              unidadeMedida: data[0].competences.unit,
              validationRules: data[0].competences.validation_rules,
            }
          : null,
      };

      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === activityId ? updatedMappedActivity : activity
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar status da atividade:", err.message);
      setError(`Erro ao atualizar status da atividade: "${err.message}"`);
    } finally {
      setLoading(false);
    }
  };

  // Exclui uma atividade do Supabase
  const deleteActivity = async (activityId) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("user_rsc")
        .delete()
        .eq("id", activityId);

      if (error) {
        throw error;
      }

      setActivities((prev) =>
        prev.filter((activity) => activity.id !== activityId)
      );
    } catch (err) {
      console.error("Erro ao excluir atividade:", err.message);
      setError(`Erro ao excluir atividade: "${err.message}"`);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    competencyItems,
    activities,
    totalScore,
    categoryScores,
    nextProgressionScore,
    loading,
    error, // Expõe o erro para o consumidor do contexto
    registerActivity,
    updateActivityStatus,
    deleteActivity,
  };

  return (
    <CompetencyContext.Provider value={value}>
      {/* Renderiza os filhos apenas quando não estiver carregando */}
      {!loading && children}
      {/* Ou, se preferir, pode mostrar um spinner de carregamento aqui */}
      {/* {loading && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>} */}
    </CompetencyContext.Provider>
  );
};
