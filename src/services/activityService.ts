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

export interface CreateActivityData {
  user_id: string;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string;
  data_fim: string;
}

// Função para criar uma atividade (agora muito mais simples)
export const createActivity = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    // A criação do perfil do usuário agora é responsabilidade do AuthProvider.
    // Nós apenas tentamos inserir a atividade diretamente.
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
      // Se ainda houver um erro de chave estrangeira, significa que o perfil
      // realmente não pôde ser criado, e devemos lançar o erro.
      console.error('Supabase error ao criar atividade:', error);
      throw new Error(`Erro ao criar atividade: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Erro na função createActivity:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao criar atividade');
  }
};

// As outras funções (getUserActivities, updateActivity, etc.) permanecem as mesmas.
// ... (cole o resto das suas funções aqui)
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

export const deleteActivity = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('user_rsc')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar atividade:', error);
    throw new Error(`Erro ao deletar atividade: ${error.message}`);
  }
};

export const getUserActivityStats = async (userId: string) => {
  // Busca todas as atividades do usuário
  const { data, error } = await supabase
    .from('user_rsc')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao buscar estatísticas de atividades:', error);
    throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
  }

  // Calcula estatísticas básicas
  const totalActivities = data ? data.length : 0;
  const totalPoints = data ? data.reduce((sum: number, activity: any) => sum + (activity.quantity * activity.value), 0) : 0;

  // Calcula atividades por categoria
  const activitiesByCategory: Record<string, number> = {};
  const pointsByCategory: Record<string, number> = {};
  
  if (data) {
    data.forEach((activity: any) => {
      const category = activity.competence_id || 'Desconhecida';
      activitiesByCategory[category] = (activitiesByCategory[category] || 0) + 1;
      pointsByCategory[category] = (pointsByCategory[category] || 0) + (activity.quantity * activity.value);
    });
  }

  return {
    totalActivities,
    totalPoints,
    activitiesByCategory,
    pointsByCategory
  };
};
