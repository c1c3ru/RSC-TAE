import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import supabase from "../utils/supabaseClient"; 
import { useAuth } from "./AuthContext"; 

const CompetencyContext = createContext();

export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error("useCompetency must be used within a CompetencyProvider");
  }
  return context;
};

export const CompetencyProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [competencyItems, setCompetencyItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState([0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nextProgressionScore = 100; 

  const fetchCompetencyDefinitions = useCallback(async () => {
    if (!supabase) {
      setError("Cliente Supabase não inicializado.");
      setLoading(false);
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("competences")
        .select(`
          id,
          category,
          title,
          type,
          points_per_unit,
          max_points,
          unit,
          validation_rules
        `);

      if (fetchError) {
        console.error("Erro ao buscar definições de competências:", fetchError.message, fetchError.details);
        setError(`Erro ao buscar definições de competências: ${fetchError.message}`);
        setCompetencyItems([]);
        return false;
      }
      const mappedItems = data.map(item => ({
        id: item.id,
        categoria: item.category, 
        titulo: item.title,
        tipoCalculo: item.type,
        valorPonto: item.points_per_unit,
        pontuacaoMaxima: item.max_points,
        unidadeMedida: item.unit,
        validationRules: item.validation_rules,
      }));
      setCompetencyItems(mappedItems);
      return true;
    } catch (err) {
      console.error("Erro inesperado ao buscar definições de competências:", err);
      setError(`Erro inesperado ao buscar definições de competências: ${err.message}`);
      setCompetencyItems([]);
      return false;
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    if (!currentUser || authLoading) {
      setActivities([]);
      return false;
    }
     if (!supabase) {
      setError("Cliente Supabase não inicializado.");
      setLoading(false);
      return false;
    }
    setLoading(true); 
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("user_rsc")
        .select(
          `
            user_id,
            competence_id,
            value,
            date_awarded,
            quantity,
            achieved_points, 
            competence:competences!user_rsc_competence_id_fkey (
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

      if (fetchError) {
        // Log detalhado do erro do Supabase
        console.error("Erro ao buscar atividades do usuário (Supabase):", fetchError);
        setError(`Erro ao buscar suas atividades: ${fetchError.message}`);
        setActivities([]);
        return false;
      }

      const mappedActivities = data.map((dbActivity) => ({
        userId: dbActivity.user_id,
        itemCompetenciaId: dbActivity.competence_id,
        quantidade: dbActivity.quantity,
        pontuacao: dbActivity.value, 
        dataRegistro: dbActivity.date_awarded,
        achieved_points_from_db: dbActivity.achieved_points, 
        itemCompetenciaDetails: dbActivity.competence
          ? {
              id: dbActivity.competence.id,
              categoria: dbActivity.competence.category,
              titulo: dbActivity.competence.title,
              tipoCalculo: dbActivity.competence.type,
              valorPonto: dbActivity.competence.points_per_unit,
              pontuacaoMaxima: dbActivity.competence.max_points,
              unidadeMedida: dbActivity.competence.unit,
              validationRules: dbActivity.competence.validation_rules,
            }
          : null,
      }));
      setActivities(mappedActivities);
      return true;
    } catch (err) {
      console.error("Erro inesperado ao buscar atividades do usuário (Catch):", err);
      setError(`Erro inesperado ao buscar suas atividades: ${err.message}`);
      setActivities([]);
      return false;
    }
  }, [currentUser, authLoading]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true); 
      setError(null);
      if (authLoading || !supabase) { 
          if(!supabase && !authLoading) setError("Cliente Supabase não inicializado.");
          setLoading(false);
          return;
      }

      const definitionsSuccess = await fetchCompetencyDefinitions();
      if (definitionsSuccess && currentUser) {
        await fetchActivities();
      } else if (!currentUser) {
        setActivities([]); 
      }
      setLoading(false); 
    };
    loadInitialData();
  }, [currentUser, authLoading, fetchActivities, fetchCompetencyDefinitions]);

  useEffect(() => {
    if (!activities.length) { 
      setTotalScore(0);
      setCategoryScores(Array(6).fill(0)); 
      return;
    }
    // Se competencyItems ainda não carregou, esperamos.
    // No entanto, itemCompetenciaDetails já deve vir embedado de fetchActivities.
    // if (!competencyItems.length && activities.some(act => !act.itemCompetenciaDetails)) {
    //     return; 
    // }

    const catScores = Array(6).fill(0); 
    let total = 0;
    const categoryMap = {
      "Administrativas": 0, 
      "Experiência": 1, 
      "Formação": 2,
      "Produção Científica": 3, 
      "Eventos e Cursos": 4,   
      "Atividades de Ensino": 5 
    };

    activities.forEach((activity) => {
      total += activity.pontuacao || 0;
      const itemDetails = activity.itemCompetenciaDetails; // Usar diretamente o objeto embedado
      
      if (itemDetails && itemDetails.categoria) { 
        const categoryName = itemDetails.categoria; 
        const categoryIndex = categoryMap[categoryName];
        
        if (typeof categoryIndex === 'number' && categoryIndex >= 0 && categoryIndex < catScores.length) {
          catScores[categoryIndex] += activity.pontuacao || 0;
        } else {
          console.warn(`Categoria da competência inválida ou não mapeada no categoryMap: '${categoryName}' para item ID ${activity.itemCompetenciaId}`);
        }
      } else {
        console.warn(`Detalhes da competência ou categoria não encontrados para a atividade com item ID ${activity.itemCompetenciaId}. Detalhes recebidos:`, itemDetails);
      }
    });
    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities]); // Removido competencyItems das dependências, pois itemCompetenciaDetails é usado

  const registerActivity = async (activityDataFromForm) => {
    if (!currentUser) {
      setError("Usuário não autenticado para registrar atividade.");
      return false; 
    }
    if (!supabase) {
      setError("Cliente Supabase não inicializado.");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const newRecord = {
        user_id: currentUser.id,
        competence_id: activityDataFromForm.competence_id,
        value: activityDataFromForm.achieved_points, 
        quantity: activityDataFromForm.quantity, 
        date_awarded: activityDataFromForm.date_awarded ? new Date(activityDataFromForm.date_awarded).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        achieved_points: activityDataFromForm.achieved_points, 
        // Removido: status, pois a coluna não existe na tabela user_rsc conforme o erro.
        // Se você adicionou a coluna 'status', pode descomentar a linha abaixo.
        // status: 'pendente', 
      };
      
      // Se você não tem a coluna 'description' ou 'documents' em 'user_rsc', remova-as daqui também.
      if (activityDataFromForm.description) {
        newRecord.description = activityDataFromForm.description; // Requer coluna 'description'
      }
      if (activityDataFromForm.documents && activityDataFromForm.documents.length > 0) {
        newRecord.documents = activityDataFromForm.documents; // Requer coluna 'documents' (JSONB)
      }


      const { data, error: insertError } = await supabase
        .from("user_rsc")
        .insert(newRecord)
        .select(`
            user_id, 
            competence_id, 
            value, 
            date_awarded, 
            quantity, 
            achieved_points,
            description, /* Adicione se a coluna existir */
            documents, /* Adicione se a coluna existir */
            competence:competences!user_rsc_competence_id_fkey ( 
              id, category, title, type, points_per_unit, max_points, unit, validation_rules
            )
        `); 

      if (insertError) throw insertError;

      if (!data || data.length === 0) {
        throw new Error("Nenhum dado retornado após a inserção da atividade.");
      }

      const insertedData = data[0];
      const newMappedActivity = {
        userId: insertedData.user_id,
        itemCompetenciaId: insertedData.competence_id,
        quantidade: insertedData.quantity,
        pontuacao: insertedData.value, 
        dataRegistro: insertedData.date_awarded,
        achieved_points_from_db: insertedData.achieved_points,
        // Adicione description e documents se as colunas existirem e forem selecionadas
        // description: insertedData.description,
        // documents: insertedData.documents,
        itemCompetenciaDetails: insertedData.competence ? {
              id: insertedData.competence.id,
              categoria: insertedData.competence.category,
              titulo: insertedData.competence.title,
              tipoCalculo: insertedData.competence.type,
              valorPonto: insertedData.competence.points_per_unit,
              pontuacaoMaxima: insertedData.competence.max_points,
              unidadeMedida: insertedData.competence.unit,
              validationRules: insertedData.competence.validation_rules,
            } : null,
      };
      setActivities((prev) => [...prev, newMappedActivity]);
      return true; 
    } catch (err) {
      console.error("Erro ao registrar atividade (Catch):", err.message, err.details || err);
      setError(`Erro ao registrar atividade: ${err.message}`);
      return false; 
    } finally {
      setLoading(false);
    }
  };

  const updateActivityStatus = async (identifiers, newData) => {
    console.warn("updateActivityStatus: Função não implementada completamente devido à estrutura atual da tabela user_rsc.");
    return false; 
  };

  const deleteActivity = async (identifiers) => {
     if (!supabase) {
      setError("Cliente Supabase não inicializado.");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("user_rsc")
        .delete()
        .eq("user_id", identifiers.userId)
        .eq("competence_id", identifiers.competenceId); 
      
      if (deleteError) throw deleteError;
      
      setActivities((prev) => prev.filter(act =>
          !(act.userId === identifiers.userId && act.itemCompetenciaId === identifiers.competenceId)
        )
      );
      return true;
    } catch (err) {
      console.error("Erro ao excluir atividade:", err.message, err.details);
      setError(`Erro ao excluir atividade: ${err.message}`);
      return false;
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
    error,
    registerActivity,
    updateActivityStatus,
    deleteActivity,
    fetchActivities, 
    fetchCompetencyDefinitions 
  };

  return (
    <CompetencyContext.Provider value={value}>
      {children} 
    </CompetencyContext.Provider>
  );
};
