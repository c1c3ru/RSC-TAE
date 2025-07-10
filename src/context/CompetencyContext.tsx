import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

// Tipos principais
export interface CompetencyItem {
  id: string;
  titulo: string;
  descricao: string;
  criterio: string;
  pontuacaoMaxima: number;
  documentosComprobatorios: string;
  unidadeMedida: string;
  valorPonto: number;
  tipoCalculo: string;
  unit: string;
  category?: string;
  [key: string]: any;
}

export interface Activity {
  id: string;
  itemCompetenciaId: string;
  titulo: string;
  pontuacao: number;
  quantidade: number;
  status: string;
  dataInicio?: string;
  dataFim?: string;
  created_at?: string;
  categoria?: string;
  [key: string]: any;
}

interface CompetencyContextType {
  competencyItems: CompetencyItem[];
  activities: Activity[];
  totalScore: number;
  categoryScores: number[];
  loading: boolean;
  registerActivity: (activityData: any) => Promise<Activity>;
  updateActivityStatus: (activityId: string, status: string, comments?: string) => Promise<void>;
  getActivityStats: () => { approved: number; pending: number; rejected: number; total: number };
  getProgressPercentage: () => number;
  deleteActivity: (activityId: string) => Promise<void>;
}

const CompetencyContext = createContext<CompetencyContextType | undefined>(undefined);

export const useCompetency = (): CompetencyContextType => {
  const context = useContext(CompetencyContext);
  if (!context) {
    throw new Error('useCompetency must be used within a CompetencyProvider');
  }
  return context;
};

interface CompetencyProviderProps {
  children: ReactNode;
}

export const CompetencyProvider: React.FC<CompetencyProviderProps> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [competencyItems, setCompetencyItems] = useState<CompetencyItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [categoryScores, setCategoryScores] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState<boolean>(true);
  const nextProgressionScore = 100;

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getCompetences, getUserActivities } = await import('../services/activityService');
        const [competences, userActivities] = await Promise.all([
          getCompetences(),
          getUserActivities()
        ]);
        setCompetencyItems((competences || []).map((item: any) => ({
          ...item,
          titulo: item.title || item.titulo || '',
          descricao: item.description || item.descricao || '',
          criterio: item.criteria || item.criterio || '',
          pontuacaoMaxima: item.max_points ?? item.pontuacaoMaxima,
          documentosComprobatorios: item.document_required || item.documentosComprobatorios || '',
          unidadeMedida: item.unit || item.unidadeMedida || 'unidades',
          valorPonto: item.points_per_unit || item.valorPonto || 0,
          tipoCalculo: item.calculation_type || item.tipoCalculo || 'quantidade',
          unit: item.unit || item.unidadeMedida || 'unidades',
          category: item.category || ''
        })));
        setActivities(userActivities || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setCompetencyItems([]);
        setActivities([]);
        const storedActivities = localStorage.getItem('activities');
        if (storedActivities) {
          try {
            const parsed = JSON.parse(storedActivities);
            if (Array.isArray(parsed)) {
              setActivities(parsed);
            }
          } catch (parseError) {
            console.error('Error parsing stored activities:', parseError);
            localStorage.removeItem('activities');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && currentUser) {
      loadData();
    } else if (!authLoading && !currentUser) {
      setCompetencyItems([]);
      setActivities([]);
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (!activities.length) {
      setTotalScore(0);
      setCategoryScores([0, 0, 0, 0, 0, 0, 0]);
      return;
    }
    const catScores = [0, 0, 0, 0, 0, 0, 0];
    const categoryNameToIndex: { [key: string]: number } = {
      'Administrativas': 0,
      'Experiência': 1,
      'Formação': 2,
      'Formação Complementar': 3,
      'Produção Científica': 4,
      'Eventos': 5,
      'Ensino': 6,
    };
    let total = 0;
    activities.forEach(activity => {
      total += activity.pontuacao || 0;
      let categoryName = '';
      if (activity.categoria) {
        categoryName = activity.categoria;
      } else {
        const item = competencyItems.find(i => i.id === activity.itemCompetenciaId);
        if (item && item.category) {
          categoryName = item.category;
        }
      }
      let categoryIndex = -1;
      if (categoryNameToIndex.hasOwnProperty(categoryName)) {
        categoryIndex = categoryNameToIndex[categoryName];
      }
      if (categoryIndex >= 0 && categoryIndex < catScores.length) {
        catScores[categoryIndex] += activity.pontuacao || 0;
      }
    });
    setTotalScore(total);
    setCategoryScores(catScores);
  }, [activities, competencyItems]);

  const registerActivity = useCallback(async (activityData: any) => {
    try {
      const { createActivity } = await import('../services/activityService');
      const newActivity = await createActivity(activityData);
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
      return newActivity;
    } catch (error) {
      console.error('Error registering activity:', error);
      throw error;
    }
  }, [activities]);

  const updateActivityStatus = useCallback(async (activityId: string, status: string, comments = '') => {
    try {
      const { updateActivityStatus: updateActivityStatusService } = await import('../services/activityService');
      await updateActivityStatusService(activityId, status, comments);
      const updatedActivities = activities.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            status,
            observacoes: comments,
            updated_at: new Date().toISOString()
          };
        }
        return activity;
      });
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error updating activity status:', error);
      throw error;
    }
  }, [activities]);

  const getActivityStats = useCallback(() => {
    const total = activities.length;
    const approved = activities.filter(a => a.status === 'aprovada').length;
    const pending = activities.filter(a => a.status === 'pendente').length;
    const rejected = activities.filter(a => a.status === 'rejeitada').length;
    return { approved, pending, rejected, total };
  }, [activities]);

  const getProgressPercentage = useCallback(() => {
    return Math.min((totalScore / nextProgressionScore) * 100, 100);
  }, [totalScore, nextProgressionScore]);

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      const { deleteActivity: deleteActivityService } = await import('../services/activityService');
      await deleteActivityService(activityId);
      const updatedActivities = activities.filter(a => a.id !== activityId);
      setActivities(updatedActivities);
      localStorage.setItem('activities', JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }, [activities]);

  const contextValue: CompetencyContextType = useMemo(() => ({
    competencyItems,
    activities,
    totalScore,
    categoryScores,
    loading,
    registerActivity,
    updateActivityStatus,
    getActivityStats,
    getProgressPercentage,
    deleteActivity
  }), [competencyItems, activities, totalScore, categoryScores, loading, registerActivity, updateActivityStatus, getActivityStats, getProgressPercentage, deleteActivity]);

  return (
    <CompetencyContext.Provider value={contextValue}>
      {children}
    </CompetencyContext.Provider>
  );
}; 