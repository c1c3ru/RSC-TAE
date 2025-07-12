import { supabase } from '../utils/supabaseClient';
import { getCategoryName } from '../data/competencyItems';

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

    // Busca atividades com join para a tabela competences
    let { data, error } = await supabase
      .from('user_rsc')
      .select(`
        *,
        competences(
          category,
          title
        )
      `)
      .eq('user_id', userId)
      .order('date_awarded', { ascending: false });

    if (error) {
      console.error('Erro no join, tentando busca simples:', error);
      // Se falhar, tenta buscar apenas as atividades
      const { data: simpleData, error: simpleError } = await supabase
        .from('user_rsc')
        .select('*')
        .eq('user_id', userId)
        .order('date_awarded', { ascending: false });

      if (simpleError) {
        console.error('Erro ao buscar atividades:', simpleError);
        throw new Error(`Erro ao buscar atividades: ${simpleError.message}`);
      }

      data = simpleData;
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
  try {
    // Busca atividades com join para a tabela competences
    let { data, error } = await supabase
      .from('user_rsc')
      .select(`
        *,
        competences(
          category,
          title
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro no join, tentando busca simples:', error);
      // Se falhar, tenta buscar apenas as atividades
      const { data: simpleData, error: simpleError } = await supabase
        .from('user_rsc')
        .select('*')
        .eq('user_id', userId);

      if (simpleError) {
        console.error('Erro ao buscar estatísticas de atividades:', simpleError);
        throw new Error(`Erro ao buscar estatísticas: ${simpleError.message}`);
      }

      data = simpleData;
    }

    // Calcula estatísticas básicas
    const totalActivities = data ? data.length : 0;
    const totalPoints = data ? Math.round(data.reduce((sum: number, activity: any) => {
      const points = activity.quantity * activity.value;
      return sum + Math.round(points * 100) / 100; // Arredonda para 2 casas decimais
    }, 0) * 10) / 10 : 0; // Arredondamento final para 1 casa decimal

    // Calcula atividades por categoria usando o campo category do banco
    const activitiesByCategory: Record<string, number> = {};
    const pointsByCategory: Record<string, number> = {};
    const categoryNames: Record<string, string> = {};
    
    if (data) {
      data.forEach((activity: any) => {
        // Se temos dados do join, usa a categoria do banco, senão usa o competence_id
        const category = activity.competences?.category || activity.competence_id || 'Desconhecida';
        const categoryName = getCategoryName(category);
        
        activitiesByCategory[category] = (activitiesByCategory[category] || 0) + 1;
        const categoryPoints = activity.quantity * activity.value;
        const currentPoints = pointsByCategory[category] || 0;
        const newPoints = currentPoints + Math.round(categoryPoints * 100) / 100;
        pointsByCategory[category] = Math.round(newPoints * 10) / 10;
        categoryNames[category] = categoryName;
      });
    }

    return {
      totalActivities,
      totalPoints,
      activitiesByCategory,
      pointsByCategory,
      categoryNames
    };
  } catch (error) {
    console.error('Erro na função getUserActivityStats:', error);
    throw error;
  }
};
