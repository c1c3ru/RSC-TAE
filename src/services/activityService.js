
import supabase from '../utils/supabaseClient';

/**
 * Activity Service - handles all activity-related database operations
 */

// Get all user RSC records (competency activities)
export const getUserActivities = async () => {
  try {
    // Trocar getUser por getSession para maior compatibilidade
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const user = session?.user;
    if (sessionError || !user) {
      console.warn('User not authenticated, returning empty activities');
      return [];
    }

    const { data, error } = await supabase
      .from('user_rsc')
      .select(`
        *,
        competences (
          id,
          category,
          title,
          type,
          points_per_unit,
          max_points,
          unit
        )
      `)
      .eq('user_id', user.id)
      .order('date_awarded', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return [];
    }

    // Transform data to match the expected format
    const transformedData = data?.map(item => ({
      id: item.id,
      itemCompetenciaId: item.competence_id,
      titulo: item.competences?.title || '',
      pontuacao: item.value || 0,
      quantidade: item.quantity || 0,
      status: 'aprovada',
      dataInicio: item.data_inicio,
      dataFim: item.data_fim,
      created_at: item.date_awarded,
      categoria: item.competences?.category || 1
    })) || [];

    return transformedData;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

// Create a new RSC record
export const createActivity = async (activityData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get competence details to calculate points
    const { data: competence, error: compError } = await supabase
      .from('competences')
      .select('*')
      .eq('id', activityData.itemCompetenciaId)
      .single();

    if (compError) throw compError;

    // Calculate value based on quantity and points per unit
    const calculatedValue = (activityData.quantidade || 1) * competence.points_per_unit;
    const finalValue = Math.min(calculatedValue, competence.max_points);

    const { data, error } = await supabase
      .from('user_rsc')
      .insert([
        {
          user_id: user.id,
          competence_id: activityData.itemCompetenciaId,
          quantity: activityData.quantidade || 1,
          value: finalValue,
          data_inicio: activityData.dataInicio || null,
          data_fim: activityData.dataFim || null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Return in expected format
    return {
      id: data.id,
      itemCompetenciaId: data.competence_id,
      titulo: competence.title,
      pontuacao: data.value,
      quantidade: data.quantity,
      status: 'aprovada',
      dataInicio: data.data_inicio,
      dataFim: data.data_fim,
      created_at: data.date_awarded,
      categoria: competence.category
    };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

// Update activity (RSC record)
export const updateActivityStatus = async (activityId, status, observacoes = '') => {
  try {
    // For this new structure, we might not need status updates
    // since user_rsc represents approved activities
    // But we can update the dates if needed
    const { data, error } = await supabase
      .from('user_rsc')
      .update({ 
        data_atualizacao: new Date().toISOString()
      })
      .eq('id', activityId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

// Delete an RSC record
export const deleteActivity = async (activityId) => {
  try {
    const { error } = await supabase
      .from('user_rsc')
      .delete()
      .eq('id', activityId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

// Get activity statistics
export const getActivityStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_rsc')
      .select('id')
      .eq('user_id', user.id);

    if (error) throw error;

    const stats = {
      total: data.length,
      approved: data.length, // All records in user_rsc are approved
      pending: 0,
      rejected: 0
    };

    return stats;
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    throw error;
  }
};

// Get total score for user
export const getTotalScore = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_rsc')
      .select('value')
      .eq('user_id', user.id);

    if (error) throw error;

    const total = data.reduce((sum, record) => sum + (record.value || 0), 0);
    return total;
  } catch (error) {
    console.error('Error calculating total score:', error);
    throw error;
  }
};

// Get competences (for form options)
export const getCompetences = async () => {
  try {
    const { data, error } = await supabase
      .from('competences')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching competences:', error);
    throw error;
  }
};
