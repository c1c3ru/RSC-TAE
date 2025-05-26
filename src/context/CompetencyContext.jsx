import React, { createContext, useContext, useState, useEffect } from 'react';
import { competencyItems as itemsData } from '../data/competencyItems'; // Itens de competência locais como fallback
import supabase from '../utils/supabaseClient'; // Cliente Supabase
import { useAuth } from './AuthContext'; // Hook de autenticação

// Cria o contexto de Competência
const CompetencyContext = createContext();

// Hook personalizado para usar o contexto de competência
export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error('useCompetency must be used within a CompetencyProvider');
  }
  return context;
};

// Define os níveis de progressão e suas pontuações alvo
// Atualizado com base nas pontuações fornecidas para RSC-I, RSC-II, RSC-III e RSC-IV
const PROGRESSION_LEVELS = [
  { level: 'Nível I', scoreTarget: 0 }, // Ponto de partida
  { level: 'Nível II (RSC-I)', scoreTarget: 25 }, // Pontuação mínima para RSC-I
  { level: 'Nível III (RSC-II)', scoreTarget: 50 }, // Pontuação mínima para RSC-II
  { level: 'Nível IV (RSC-III)', scoreTarget: 50 }, // Pontuação mínima para RSC-III (se for cumulativo, é o mesmo que RSC-II, o que é incomum para níveis sequenciais)
  { level: 'Nível V (RSC-IV)', scoreTarget: 75 }, // Pontuação para RSC-IV
  // Adicione mais níveis conforme necessário
];

// Componente Provedor de Competência
export const CompetencyProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [competencyItems, setCompetencyItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState([0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para carregar itens de competência (locais ou do Supabase) e atividades do Supabase
  useEffect(() => {
    // Carrega itens de competência de dados locais.
    // Se você tiver uma tabela 'competences' no Supabase, você pode buscar daqui também.
    setCompetencyItems(itemsData);

    const fetchActivities = async () => {
      console.log('CompetencyContext: fetchActivities chamado. currentUser:', currentUser, 'authLoading:', authLoading);

      if (!currentUser || authLoading) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // CORREÇÃO: Removido 'status' da seleção.
        // SUBSTITUA 'your_competence_fkey_constraint_name' pelo nome REAL da sua Foreign Key.
        const { data, error } = await supabase
          .from('user_rsc')
          .select(`
            id,
            user_id,
            competence_id,
            value,
            date_awarded,
            observacoes,
            data_atualizacao,
            documents_urls,
            data_inicio,
            data_fim,
            quantidade,
            description,
            competences!your_competence_fkey_constraint_name(
              id,
              category,
              title,
              type,
              points_per_unit,
              max_points,
              unit,
              validation_rules
            )
          `)
          .eq('user_id', currentUser.id);

        if (error) {
          console.error("Erro ao buscar atividades:", error.message);
          setError(`Erro ao buscar atividades: "${error.message}"`);
          setActivities([]);
          return;
        }

        const mappedActivities = data.map(dbActivity => ({
          id: dbActivity.id,
          userId: dbActivity.user_id,
          itemCompetenciaId: dbActivity.competence_id,
          dataInicio: dbActivity.data_inicio,
          dataFim: dbActivity.data_fim,
          quantidade: dbActivity.quantidade,
          descricao: dbActivity.description, // Mapeia 'description' do DB para 'descricao' local
          pontuacao: dbActivity.value,
          observacoes: dbActivity.observacoes,
          dataRegistro: dbActivity.date_awarded,
          dataAtualizacao: dbActivity.data_atualizacao,
          documents: dbActivity.documents_urls || [],
          itemCompetenciaDetails: dbActivity.competences 
            ? { // Mapeia as colunas da tabela 'competences' para o formato local
                id: dbActivity.competences.id,
                categoria: dbActivity.competences.category,
                titulo: dbActivity.competences.title,
                tipoCalculo: dbActivity.competences.type,
                // CORREÇÃO: Usar parseFloat para garantir que sejam números
                valorPonto: parseFloat(dbActivity.competences.points_per_unit),
                pontuacaoMaxima: parseFloat(dbActivity.competences.max_points),
                unidadeMedida: dbActivity.competences.unit,
                validationRules: dbActivity.competences.validation_rules
              }
            : null
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
  }, [currentUser, authLoading]);

  // Calcula pontuação total e por categoria
  useEffect(() => {
    if (!activities.length) {
      setTotalScore(0);
      setCategoryScores([0, 0, 0, 0, 0, 0]);
      return;
    }

    const catScores = [0, 0, 0, 0, 0, 0];
    let total = 0;

    activities.forEach(activity => {
      // Todas as atividades registradas contam para a pontuação agora (sem filtro de status)
      total += activity.pontuacao;
        
      const item = activity.itemCompetenciaDetails || competencyItems.find(item => item.id === activity.itemCompetenciaId);
      
      if (item) {
        const categoryMap = {
          'Administrativas': 1, 'Experiência': 2, 'Formação': 3,
          'Produção': 4, 'Eventos': 5, 'Ensino': 6,
        };

        const categoryValue = item.categoria || categoryMap[item.category];
        const categoryIndex = (categoryValue ? parseInt(categoryValue) : 0) - 1;

        if (categoryIndex >= 0 && categoryIndex < catScores.length) {
          catScores[categoryIndex] += activity.pontuacao;
        } else {
          console.warn(`Categoria inválida ou não mapeada para o item ${item.id}:`, item.categoria || item.category);
        }
      }
    });
    
    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities, competencyItems]);

  // Registra uma nova atividade no Supabase
  const registerActivity = async (activityData) => {
    if (!currentUser) {
      setError('Usuário não autenticado para registrar atividade.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const documentUrlsToStore = activityData.documents.map(doc => ({
        id: doc.id,
        url: doc.publicURL,
        name: doc.nome,
        storagePath: doc.storagePath
      }));

      // CORREÇÃO: Removido 'status' do insert e do select de retorno.
      const { data, error } = await supabase
        .from('user_rsc')
        .insert({
          user_id: currentUser.id,
          competence_id: activityData.itemCompetenciaId,
          data_inicio: activityData.dataInicio,
          data_fim: activityData.dataFim,
          quantidade: activityData.quantidade,
          description: activityData.descricao, // Usar 'description' para o DB
          value: activityData.pontuacao,
          observacoes: activityData.observacoes,
          date_awarded: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
          documents_urls: documentUrlsToStore,
        })
        .select(`
            id,
            user_id,
            competence_id,
            value,
            date_awarded,
            observacoes,
            data_atualizacao,
            documents_urls,
            data_inicio,
            data_fim,
            quantidade,
            description,
            competences!your_competence_fkey_constraint_name(
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

      const newMappedActivity = {
        id: data[0].id,
        userId: data[0].user_id,
        itemCompetenciaId: data[0].competence_id,
        dataInicio: data[0].data_inicio,
        dataFim: data[0].data_fim,
        quantidade: data[0].quantidade,
        descricao: data[0].description, // Mapear 'description' do DB para 'descricao' local
        pontuacao: data[0].value,
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
              // CORREÇÃO: Usar parseFloat para garantir que sejam números
              valorPonto: parseFloat(data[0].competences.points_per_unit),
              pontuacaoMaxima: parseFloat(data[0].competences.max_points),
              unidadeMedida: data[0].competences.unit,
              validationRules: data[0].competences.validation_rules
            }
          : null
      };

      setActivities(prev => [...prev, newMappedActivity]);
      return newMappedActivity;
    } catch (err) {
      console.error("Erro ao registrar atividade:", err.message);
      setError(`Erro ao registrar atividade: "${err.message}"`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // REMOVIDA: updateActivityStatus não é mais necessária
  // const updateActivityStatus = async (activityId, status, comments = '') => { ... };

  // Exclui uma atividade do Supabase
  const deleteActivity = async (activityId) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('user_rsc')
        .delete()
        .eq('id', activityId);

      if (error) {
        throw error;
      }

      setActivities(prev => prev.filter(activity => activity.id !== activityId));
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
    progressionLevels: PROGRESSION_LEVELS, // Expondo os níveis de progressão
    loading,
    error,
    registerActivity,
    // updateActivityStatus, // Removido do valor exportado
    deleteActivity
  };

  return (
    <CompetencyContext.Provider value={value}>
      {!loading && children} 
    </CompetencyContext.Provider>
  );
};
