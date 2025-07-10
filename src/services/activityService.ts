
import { supabase } from '../utils/supabaseClient';

export interface Activity {
  id?: number;
  user_id: string;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string;
  data_fim: string;
  date_awarded?: string;
  data_atualizacao?: string;
}

// Ajustar interfaces e funções para refletir o schema do banco
export interface CreateActivityData {
  user_id: string;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string;
  data_fim: string;
}

export const createActivity = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    const { data, error } = await supabase
      .from('user_rsc')
      .insert([{
        user_id: activityData.user_id,
        competence_id: activityData.competence_id,
        quantity: activityData.quantity,
        value: activityData.value,
        data_inicio: activityData.data_inicio,
        data_fim: activityData.data_fim,
        date_awarded: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Erro ao criar atividade: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating activity:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao criar atividade');
  }
};

export const getUserActivities = async (userId: string): Promise<Activity[]> => {
  try {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    const { data, error } = await supabase
      .from('user_rsc')
      .select('*')
      .eq('user_id', userId)
      .order('date_awarded', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Erro ao buscar atividades: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error loading user activities:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao carregar atividades');
  }
};

export const updateActivity = async (
  activityId: number, 
  updateData: Partial<Activity>
): Promise<Activity> => {
  try {
    const { data, error } = await supabase
      .from('user_rsc')
      .update({
        ...updateData,
        data_atualizacao: new Date().toISOString(),
      })
      .eq('id', activityId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Erro ao atualizar atividade: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating activity:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao atualizar atividade');
  }
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_rsc')
      .delete()
      .eq('id', activityId);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Erro ao deletar atividade: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting activity:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao deletar atividade');
  }
};

export const getActivityById = async (activityId: number): Promise<Activity | null> => {
  try {
    const { data, error } = await supabase
      .from('user_rsc')
      .select('*')
      .eq('id', activityId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Activity not found
      }
      console.error('Supabase error:', error);
      throw new Error(`Erro ao buscar atividade: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting activity by id:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao buscar atividade');
  }
};

export const getUserActivityStats = async (userId: string): Promise<{
  totalPoints: number;
  totalActivities: number;
  activitiesByCategory: Record<string, number>;
}> => {
  try {
    const activities = await getUserActivities(userId);
    
    const totalPoints = activities.reduce(
      (sum, activity) => sum + (activity.quantity * activity.value), 
      0
    );
    
    const totalActivities = activities.length;
    
    const activitiesByCategory: Record<string, number> = {};
    activities.forEach(activity => {
      const categoryPrefix = activity.competence_id.split('-')[0];
      activitiesByCategory[categoryPrefix] = (activitiesByCategory[categoryPrefix] || 0) + 1;
    });

    return {
      totalPoints,
      totalActivities,
      activitiesByCategory,
    };
  } catch (error) {
    console.error('Error getting user activity stats:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao calcular estatísticas');
  }
};

// Função utilitária para validar documentos anexados
export function validateDocuments(files: File[], validationRules: any): string | null {
  if (!validationRules || !validationRules.docs) return null;
  const requiredDocs = validationRules.docs as string[];
  // Exemplo: checar se pelo menos um arquivo tem o nome ou extensão esperada
  for (const doc of requiredDocs) {
    const found = files.some(file => file.name.toLowerCase().includes(doc.toLowerCase()));
    if (!found) {
      return `É obrigatório anexar o documento: ${doc}`;
    }
  }
  return null;
}
