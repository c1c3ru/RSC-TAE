import { getCategoryName, competencyItems } from '../data/competencyItems';

export interface Activity {
  id?: number;
  user_id: string;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string | null;
  data_fim: string | null;
  date_awarded?: string;
  data_atualizacao?: string;
  competences?: {
    category: string;
    title: string;
  };
}

export interface CreateActivityData {
  user_id: string;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string;
  data_fim: string;
}

const LOCAL_STORAGE_KEY = 'rsc_activities';

const getActivitiesFromStorage = (): Activity[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveActivitiesToStorage = (activities: Activity[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activities));
};

export const createActivity = async (activityData: CreateActivityData): Promise<Activity> => {
  try {
    const dataInicio = activityData.data_inicio && activityData.data_inicio.trim() !== '' 
      ? activityData.data_inicio 
      : null;
    const dataFim = activityData.data_fim && activityData.data_fim.trim() !== '' 
      ? activityData.data_fim 
      : null;

    const activities = getActivitiesFromStorage();
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id || 0)) + 1 : 1;

    const newActivity: Activity = {
      id: newId,
      user_id: activityData.user_id,
      competence_id: activityData.competence_id,
      quantity: activityData.quantity,
      value: activityData.value,
      data_inicio: dataInicio,
      data_fim: dataFim,
      date_awarded: new Date().toISOString(),
      data_atualizacao: new Date().toISOString(),
    };

    activities.push(newActivity);
    saveActivitiesToStorage(activities);

    return newActivity;
  } catch (error) {
    console.error('Erro na função createActivity:', error);
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

    const activities = getActivitiesFromStorage().filter(a => a.user_id === userId);
    
    // Simulate join with competences
    const joinedActivities = activities.map(activity => {
      const comp = competencyItems.find(c => c.id === activity.competence_id);
      return {
        ...activity,
        competences: comp ? {
          category: comp.category,
          title: comp.title,
        } : undefined
      };
    });

    return joinedActivities.sort((a, b) => {
      const dateA = new Date(a.date_awarded || 0).getTime();
      const dateB = new Date(b.date_awarded || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error loading user activities:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao carregar atividades');
  }
};

export const deleteActivity = async (id: number): Promise<void> => {
  try {
    const activities = getActivitiesFromStorage();
    const filtered = activities.filter(a => a.id !== id);
    saveActivitiesToStorage(filtered);
  } catch (error) {
    console.error('Erro ao deletar atividade:', error);
    throw new Error(`Erro ao deletar atividade`);
  }
};

export const getUserActivityStats = async (userId: string) => {
  try {
    const data = await getUserActivities(userId);

    const totalActivities = data ? data.length : 0;
    const totalPoints = data ? Math.round(data.reduce((sum: number, activity: Activity) => {
      const points = activity.quantity * activity.value;
      return sum + Math.round(points * 100) / 100;
    }, 0) * 10) / 10 : 0;

    const activitiesByCategory: Record<string, number> = {};
    const pointsByCategory: Record<string, number> = {};
    const categoryNames: Record<string, string> = {};
    
    if (data) {
      data.forEach((activity: Activity) => {
        const category = activity.competences?.category || activity.competence_id || 'Desconhecida';
        
        // Simulating the getCategoryName function which was imported earlier
        // if not found, use category string
        let categoryName = category;
        try {
           categoryName = getCategoryName ? getCategoryName(category) : category;
        } catch(e) {}
        
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
