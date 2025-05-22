import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { competencyItems as localCompetencyItemsData } from '../data/competencyItems'; // Keeping for fallback/initial structure reference
import { supabase } from '../utils/supabaseClient';

// Crie o contexto de Competência
const CompetencyContext = createContext();

// Hook personalizado para usar o contexto de competência
export const useCompetency = () => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error('useCompetency deve ser usado dentro de um CompetencyProvider');
  }
  return context;
};

// Componente Competency Provider
export const CompetencyProvider = ({ children }) => {
  const [competencyItems, setCompetencyItems] = useState([]); // This will hold the competence definitions
  const [activities, setActivities] = useState([]); // This will hold the user's registered activities (from user_rsc)
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState(Array(6).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nextProgressionScore = 100; // Define a meta de pontuação da próxima progressão

  // Helper function to format activity data from Supabase joins
  const formatSupabaseActivity = (item, userId) => {
    if (!item || !item.competences) {
      console.warn("Invalid item received for formatting:", item);
      return null;
    }
    return {
      // Competence definition fields
      id: item.competences.id, // Competence ID
      category: item.competences.category,
      title: item.competences.title,
      type: item.competences.type,
      points_per_unit: item.competences.points_per_unit,
      max_points: item.competences.max_points,
      unit: item.competences.unit,
      validation_rules: item.competences.validation_rules,
      // User_rsc specific fields for this activity instance
      user_id: userId, // Ensure user ID is attached
      activity_id: item.id, // The ID of the user_rsc entry itself (if it has one, for update/delete)
      itemCompetenciaId: item.competence_id, // For compatibility with existing UI logic if needed
      pontuacao: item.value, // User's earned points for this specific activity
      data_registro: item.date_awarded, // When the activity was recorded/awarded
      status: item.status, // Status (pendente, aprovada, rejeitada)
      observacoes: item.observacoes, // User's description for this activity
      data_atualizacao: item.data_atualizacao, // Last update timestamp
      documents_urls: item.documents_urls || [], // Array of URLs to uploaded documents
    };
  };

  // Memoized fetch function for competences (definitions)
  const fetchCompetenceDefinitions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('competences') // Fetch from the 'competences' table
        .select('*');

      if (error) {
        throw new Error(`Erro ao buscar definições de competência: ${error.message}`);
      }
      setCompetencyItems(data || []);
    } catch (err) {
      console.error('Erro ao buscar definições de competência:', err);
      // Decide if this error should block the app or just log
    }
  }, []);

  // Memoized fetch function for user activities (from user_rsc)
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError) {
      console.error('Erro ao obter usuário:', userError.message);
      setError(`Erro ao obter usuário: ${userError.message}`);
      setLoading(false);
      return;
    }

    if (!user) {
      setError('Usuário não autenticado.');
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_rsc') // Query the junction table
        .select(`
            id,              // ID of the user_rsc entry itself (needed for updates/deletes on user_rsc)
            user_id,
            competence_id,
            value,
            date_awarded,
            status,
            observacoes,
            data_atualizacao,
            documents_urls,  // Assuming this column exists in user_rsc for document URLs
            competences (    // Join to get competence definition details
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
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Erro ao buscar atividades: ${error.message}`);
      }

      const formattedActivities = (data || [])
        .map(item => formatSupabaseActivity(item, user.id))
        .filter(Boolean); // Filter out any nulls from formatting errors

      setActivities(formattedActivities);
    } catch (err) {
      console.error('Erro ao buscar atividades:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, as it fetches current user and then data

  // Load competence definitions and user activities on component mount
  useEffect(() => {
    fetchCompetenceDefinitions(); // Load definitions once

    // Initial fetch of user activities
    fetchActivities();

    // Set up auth listener for real-time activity re-fetch
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Re-fetch activities if user signs in or out, or session changes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
        fetchActivities();
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchActivities, fetchCompetenceDefinitions]); // Dependencies: memoized fetch functions

  // Recalculate scores whenever activities or competencyItems change
  useEffect(() => {
    const catScores = Array(6).fill(0); // Assuming 6 categories for now, adjust if dynamic
    let total = 0;

    activities.forEach(activity => {
      // Only count approved or pending activities for scores
      if (activity.status !== 'rejeitada') {
        total += activity.pontuacao;
        // Find the competence item definition to get the category
        const itemDefinition = competencyItems.find(item => item.id === activity.itemCompetenciaId);
        if (itemDefinition) {
          // Assuming category is a number 1-6. Adjust if `category` is a string like "CAT1"
          const categoryIndex = parseInt(itemDefinition.category.replace('CAT', '')) - 1; 
          // Ensure categoryIndex is valid
          if (!isNaN(categoryIndex) && categoryIndex >= 0 && categoryIndex < catScores.length) {
            catScores[categoryIndex] += activity.pontuacao;
          }
        }
      }
    });
    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities, competencyItems]); // Depends on activities and competence definitions

  // Registers a new activity in Supabase
  const registerActivity = async (activityData) => {
    setLoading(true);
    setError(null);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError) {
      console.error('Erro ao obter usuário para registro:', userError.message);
      setError(`Erro ao obter usuário para registro: ${userError.message}`);
      setLoading(false);
      return null;
    }

    if (!user) {
      setError('Usuário não autenticado para registrar atividade.');
      setLoading(false);
      return null;
    }

    // Prepare data for insertion into `user_rsc`
    const newActivityEntry = {
      user_id: user.id,
      competence_id: activityData.itemCompetenciaId, // The ID of the competence
      value: activityData.pontuacao, // The points the user earned for this competence
      date_awarded: new Date().toISOString(), // Use current date as awarded date
      status: activityData.status || 'pendente', // Default status
      observacoes: activityData.observacoes || null, // User's description
      documents_urls: activityData.documents_urls || [], // Array of document URLs
      // If you need to store startDate, endDate, quantity, add columns to user_rsc
      // and map them here. For now, they are used for point calculation.
    };

    try {
      const { data, error: supabaseError } = await supabase
        .from('user_rsc') // Insert into the junction table
        .insert(newActivityEntry)
        .select(`
            id,
            user_id,
            competence_id,
            value,
            date_awarded,
            status,
            observacoes,
            data_atualizacao,
            documents_urls,
            competences (
                id, category, title, type, points_per_unit, max_points, unit, validation_rules
            )
        `)
        .single(); // Expect a single row back

      if (supabaseError) {
        throw new Error(`Erro ao registrar atividade: ${supabaseError.message}`);
      }

      const addedActivity = formatSupabaseActivity(data, user.id);
      if (addedActivity) {
        setActivities(prevActivities => [...prevActivities, addedActivity]);
      }
      return addedActivity;
    } catch (err) {
      console.error('Erro ao registrar atividade:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Updates the status of an activity in Supabase (on user_rsc)
  const updateActivityStatus = async (activitySupabaseId, status, comments = '', newPontuacao = null) => {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
        setError('Usuário não autenticado para atualizar atividade.');
        setLoading(false);
        return null;
    }

    const updates = {
      status,
      observacoes: comments, // This might overwrite user's description, consider a separate field for admin comments
      data_atualizacao: new Date().toISOString()
    };

    // If newPontuacao is provided, update the value
    if (newPontuacao !== null) {
      updates.value = newPontuacao;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('user_rsc') // Update the junction table
        .update(updates)
        .eq('id', activitySupabaseId) // Use the `id` of the user_rsc entry itself
        .select(`
            id, user_id, competence_id, value, date_awarded, status, observacoes, data_atualizacao, documents_urls,
            competences (id, category, title, type, points_per_unit, max_points, unit, validation_rules)
        `)
        .single();

      if (supabaseError) {
        throw new Error(`Erro ao atualizar status da atividade: ${supabaseError.message}`);
      }

      const updatedActivity = formatSupabaseActivity(data, user.id);
      if (updatedActivity) {
          setActivities(prevActivities =>
            prevActivities.map(activity =>
              activity.activity_id === activitySupabaseId ? updatedActivity : activity
            )
          );
      }
      return updatedActivity;
    } catch (err) {
      console.error('Erro ao atualizar status da atividade:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Deletes an activity from Supabase (on user_rsc)
  const deleteActivity = async (activitySupabaseId) => {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
        setError('Usuário não autenticado para excluir atividade.');
        setLoading(false);
        return false;
    }

    try {
      const { error: supabaseError } = await supabase
        .from('user_rsc') // Delete from the junction table
        .delete()
        .eq('id', activitySupabaseId); // Use the `id` of the user_rsc entry itself

      if (supabaseError) {
        throw new Error(`Erro ao excluir atividade: ${supabaseError.message}`);
      }

      setActivities(prevActivities => prevActivities.filter(activity => activity.activity_id !== activitySupabaseId));
      return true;
    } catch (err) {
      console.error('Erro ao excluir atividade:', err);
      setError(err.message);
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
  };

  return (
    <CompetencyContext.Provider value={value}>
      {/* Conditionally render children only when not loading or if there's an error */}
      {loading && !error ? <div>Carregando competências e atividades...</div> : children}
      {error && <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', margin: '10px 0' }}>Erro: {error}</div>}
    </CompetencyContext.Provider>
  );
};