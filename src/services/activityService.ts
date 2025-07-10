
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

// Função para verificar e criar perfil do usuário se necessário
const ensureUserProfile = async (userId: string): Promise<void> => {
  try {
    // Verificar se o perfil já existe usando uma consulta mais simples
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profile')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking user profile:', checkError);
      // Se o erro for 406, pode ser um problema de permissão, vamos tentar criar o perfil
      if (checkError.code === '406') {
        console.log('Attempting to create user profile due to 406 error');
      } else {
        throw new Error('Erro ao verificar perfil do usuário');
      }
    }

    // Se o perfil não existe, criar um perfil básico
    if (!existingProfile) {
      const { error: createError } = await supabase
        .from('user_profile')
        .insert([
          {
            id: userId,
            email: '', // Será atualizado quando o usuário fizer login
            name: null,
            employee_number: null,
            job: null,
            functional_category: null,
            date_singin: new Date().toISOString(),
            education: null
          }
        ]);

      if (createError) {
        console.error('Error creating user profile:', createError);
        // Se o erro for de chave duplicada, o perfil já existe
        if (createError.code === '23505') {
          console.log('User profile already exists, continuing...');
          return;
        }
        throw new Error('Erro ao criar perfil do usuário');
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    // Não vamos falhar completamente se houver erro no perfil
    // O usuário pode continuar usando o sistema
    console.log('Continuing without user profile creation...');
  }
};

export const createActivity = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    // Garantir que o perfil do usuário existe antes de criar a atividade
    await ensureUserProfile(activityData.user_id);

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
    
    // Arredondar para 2 casas decimais para evitar imprecisões
    const roundedTotalPoints = Math.round(totalPoints * 100) / 100;
    
    const totalActivities = activities.length;
    
    const activitiesByCategory: Record<string, number> = {};
    activities.forEach(activity => {
      const categoryPrefix = activity.competence_id.split('-')[0];
      activitiesByCategory[categoryPrefix] = (activitiesByCategory[categoryPrefix] || 0) + 1;
    });

    return {
      totalPoints: roundedTotalPoints,
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
