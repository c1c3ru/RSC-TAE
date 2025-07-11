
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
    console.log('🔍 Debug - Verificando perfil do usuário:', userId);
    
    // Primeiro, verificar se o perfil já existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profile')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking user profile:', checkError);
      return;
    }
    
    if (existingProfile) {
      console.log('🔍 Debug - Perfil já existe, continuando...');
      return;
    }
    
    // Se não existe, tentar criar o perfil
    const { error: createError } = await supabase
      .from('user_profile')
      .insert([
        {
          id: userId,
          email: `user_${userId}@temp.com`, // Email temporário para evitar constraint
          name: null,
          employee_number: null,
          job: null,
          functional_category: null,
          date_singin: new Date().toISOString(),
          education: null
        }
      ]);

    if (createError) {
      console.error('Error creating/updating user profile:', createError);
      
      // Se o erro for de permissão, vamos tentar uma abordagem diferente
      if (createError.code === '42501' || createError.code === '401' || createError.code === '409') {
        console.log('Permission denied or conflict, trying alternative approach...');
        
        // Tentar inserir com ignoreDuplicates
        const { error: insertError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: userId,
              email: null,
              name: null,
              employee_number: null,
              job: null,
              functional_category: null,
              date_singin: new Date().toISOString(),
              education: null
            }
          ])
          .select()
          .maybeSingle();
        
        if (insertError) {
          console.error('Error inserting user profile:', insertError);
          
          // Se o erro for de duplicação, o perfil já existe
          if (insertError.code === '23505') {
            console.log('User profile already exists, continuing...');
            return;
          }
          
          // Se o erro for de constraint de email, tentar com email diferente
          if (insertError.code === '23505' && insertError.message.includes('user_email_key')) {
            console.log('Email constraint violation, trying with different email...');
            
            const { error: retryError } = await supabase
              .from('user_profile')
              .insert([
                {
                  id: userId,
                  email: `user_${userId}_${Date.now()}@temp.com`, // Email único
                  name: null,
                  employee_number: null,
                  job: null,
                  functional_category: null,
                  date_singin: new Date().toISOString(),
                  education: null
                }
              ]);
            
            if (retryError) {
              console.error('Error with retry email:', retryError);
            } else {
              console.log('Profile created with unique email');
              return;
            }
          }
          
          console.log('Continuing without user profile creation...');
          return;
        }
      }
    } else {
      console.log('🔍 Debug - Perfil do usuário criado/atualizado com sucesso');
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    // Não vamos falhar completamente se houver erro no perfil
    console.log('Continuing without user profile creation...');
  }
};

export const createActivity = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    console.log('🔍 Debug - Criando atividade para usuário:', activityData.user_id);
    
    // Garantir que o perfil do usuário existe antes de criar a atividade
    await ensureUserProfile(activityData.user_id);

    console.log('🔍 Debug - Criando atividade no banco...');
    
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
      
      // Se o erro for de chave estrangeira, tentar criar o perfil primeiro
      if (error.code === '23503') {
        console.log('🔍 Debug - Erro de chave estrangeira, tentando criar perfil...');
        
        const { error: profileCreateError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: activityData.user_id,
              email: `user_${activityData.user_id}@temp.com`, // Email temporário para evitar constraint
              name: null,
              employee_number: null,
              job: null,
              functional_category: null,
              date_singin: new Date().toISOString(),
              education: null
            }
          ]);
        
        if (profileCreateError) {
          console.error('Error creating profile for foreign key:', profileCreateError);
        } else {
          console.log('🔍 Debug - Perfil criado, tentando atividade novamente...');
          
          // Tentar criar a atividade novamente
          const { data: retryData, error: retryError } = await supabase
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
          
          if (retryError) {
            console.error('Supabase error on retry:', retryError);
            throw new Error(`Erro ao criar atividade: ${retryError.message}`);
          }
          
          return retryData;
        }
      }
      
      throw new Error(`Erro ao criar atividade: ${error.message}`);
    }

    console.log('🔍 Debug - Atividade criada com sucesso');
    return data;
  } catch (error) {
    console.error('Error creating activity:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao criar atividade');
  }
};

export const createActivityDirect = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    console.log('🔍 Debug - Tentando criar atividade diretamente...');
    
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
      console.error('Direct activity creation error:', error);
      throw new Error(`Erro ao criar atividade diretamente: ${error.message}`);
    }

    console.log('🔍 Debug - Atividade criada diretamente com sucesso');
    return data;
  } catch (error) {
    console.error('Error creating activity directly:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao criar atividade diretamente');
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
