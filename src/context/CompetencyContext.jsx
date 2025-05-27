import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import supabase from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";

// Create the Competency Context
const CompetencyContext = createContext();

export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error("useCompetency must be used within a CompetencyProvider");
  }
  return context;
};

const PROGRESSION_LEVELS = [
  { level: "Nível I", scoreTarget: 0 },
  { level: "Nível II (RSC-I)", scoreTarget: 25 },
  { level: "Nível III (RSC-II)", scoreTarget: 50 },
  { level: "Nível IV (RSC-III)", scoreTarget: 50 },
  { level: "Nível V (RSC-IV)", scoreTarget: 75 },
];

// Helper function to map database activity to app format
const mapActivity = (dbActivity) => ({
  id: dbActivity.id,
  userId: dbActivity.user_id,
  itemCompetenciaId: dbActivity.competence_id,
  dataInicio: dbActivity.data_inicio,
  dataFim: dbActivity.data_fim,
  quantidade: dbActivity.quantidade,
  descricao: dbActivity.description,
  pontuacao: dbActivity.value,
  observacoes: dbActivity.observacoes,
  dataRegistro: dbActivity.date_awarded,
  dataAtualizacao: dbActivity.data_atualizacao,
  documents: dbActivity.documents_urls || [],
  itemCompetenciaDetails: dbActivity.competences ? {
    id: dbActivity.competences.id,
    categoria: dbActivity.competences.category,
    titulo: dbActivity.competences.title,
    tipoCalculo: dbActivity.competences.type,
    valorPonto: parseFloat(dbActivity.competences.points_per_unit),
    pontuacaoMaxima: parseFloat(dbActivity.competences.max_points),
    unidadeMedida: dbActivity.competences.unit,
    validationRules: dbActivity.competences.validation_rules,
  } : null,
});

// Categories data for visualization
export const categoriesData = [
  { id: 1, name: 'Atividades Administrativas', color: 'rgba(54, 162, 235, 0.7)', borderColor: 'rgb(54, 162, 235)', baseColor: 'blue' },
  { id: 2, name: 'Experiência Profissional', color: 'rgba(255, 99, 132, 0.7)', borderColor: 'rgb(255, 99, 132)', baseColor: 'red' },
  { id: 3, name: 'Formação e Capacitação', color: 'rgba(75, 192, 192, 0.7)', borderColor: 'rgb(75, 192, 192)', baseColor: 'green' },
  { id: 4, name: 'Produção Científica', color: 'rgba(255, 206, 86, 0.7)', borderColor: 'rgb(255, 206, 86)', baseColor: 'yellow' },
  { id: 5, name: 'Participação em Eventos', color: 'rgba(153, 102, 255, 0.7)', borderColor: 'rgb(153, 102, 255)', baseColor: 'purple' },
  { id: 6, name: 'Atividades de Ensino', color: 'rgba(255, 159, 64, 0.7)', borderColor: 'rgb(255, 159, 64)', baseColor: 'orange' }
];

// Competency Provider Component
export const CompetencyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [competencyItems, setCompetencyItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(null);
  const [lastCalculationDate, setLastCalculationDate] = useState(null);

  // Filter competency items by category
  const filterItemsByCategory = (categoryId) => {
    setActiveCategoryFilter(prevFilter => (prevFilter === categoryId ? null : categoryId));
  };

  // Fetch competency items from Supabase
  useEffect(() => {
    const fetchCompetencyItems = async () => {
      setLoading(true);
      try {
        let query = supabase.from('competences').select('*');
        if (activeCategoryFilter) {
          query = query.eq('category', activeCategoryFilter);
        }
        const { data, error } = await query;
        if (error) throw error;
        setCompetencyItems(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetencyItems();
  }, [activeCategoryFilter]);

  // Fetch user activities from Supabase
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!currentUser) {
        setActivities([]);
        return;
      }
      const { data, error } = await supabase
        .from("user_rsc")
        .select(`*, competences(*)`)
        .eq("user_id", currentUser.id)
        .order('date_awarded', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setActivities(data.map(mapActivity));
        if (data.length > 0) {
          setLastCalculationDate(new Date().toISOString());
        }
      }
    };
    fetchUserActivities();
  }, [currentUser]);

  // Calculate scores with useMemo for performance
  const { totalScore, categoryScores, progressionTrend } = useMemo(() => {
    const catScores = Array(6).fill(0);
    const monthlyScores = {};
    
    activities.forEach(activity => {
      const item = activity.itemCompetenciaDetails;
      if (item && item.categoria) {
        const categoryIndex = parseInt(item.categoria, 10) - 1;
        if (categoryIndex >= 0 && categoryIndex < 6) {
          catScores[categoryIndex] += activity.pontuacao;
        }
      }
      
      // Calculate monthly scores for progression trend
      const date = new Date(activity.dataRegistro);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthlyScores[monthYear]) {
        monthlyScores[monthYear] = 0;
      }
      monthlyScores[monthYear] += activity.pontuacao;
    });
    
    const total = catScores.reduce((acc, score) => acc + score, 0);
    
    // Format trend data for charts
    const trendData = Object.entries(monthlyScores)
      .map(([date, score]) => ({ date, score }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.date.split('/');
        const [bMonth, bYear] = b.date.split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
    
    return { 
      totalScore: total, 
      categoryScores: catScores,
      progressionTrend: trendData
    };
  }, [activities]);

  // Register a new activity in Supabase
  const registerActivity = async (activityData) => {
    if (!currentUser) throw new Error("Usuário não autenticado.");
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Calculate points using backend function
      const { data: calculatedPoints, error: rpcError } = await supabase.rpc(
        "calculate_points_for_activity",
        {
          p_competence_id: activityData.itemCompetenciaId,
          p_quantity: activityData.quantidade,
        }
      );
      if (rpcError) throw rpcError;

      // 2. Insert activity with calculated points
      const { data, error: insertError } = await supabase
        .from("user_rsc")
        .insert({
          user_id: currentUser.id,
          competence_id: activityData.itemCompetenciaId,
          data_inicio: activityData.dataInicio,
          data_fim: activityData.dataFim,
          quantidade: activityData.quantidade,
          description: activityData.descricao,
          value: calculatedPoints,
          observacoes: activityData.observacoes,
          documents_urls: activityData.documents || [],
        })
        .select(`*, competences(*)`)
        .single();
      if (insertError) throw insertError;

      // 3. Update local state with new activity
      const newMappedActivity = mapActivity(data);
      setActivities((prev) => [...prev, newMappedActivity].sort((a,b) => 
        new Date(b.dataRegistro) - new Date(a.dataRegistro)
      ));
      setLastCalculationDate(new Date().toISOString());
      return newMappedActivity;
    } catch (err) {
      console.error("Erro ao registrar atividade:", err.message);
      setError(`Erro ao registrar atividade: "${err.message}"`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an activity from Supabase
  const deleteActivity = async (activityId) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from("user_rsc").delete().eq("id", activityId);
      if (error) throw error;
      setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
      setLastCalculationDate(new Date().toISOString());
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
    progressionTrend,
    progressionLevels: PROGRESSION_LEVELS,
    lastCalculationDate,
    loading,
    error,
    registerActivity,
    deleteActivity,
    activeCategoryFilter,
    filterItemsByCategory,
  };

  return (
    <CompetencyContext.Provider value={value}>
      {children}
    </CompetencyContext.Provider>
  );
};