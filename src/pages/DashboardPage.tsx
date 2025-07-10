
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompetency } from '../context/CompetencyContext';
import ScoreCard from '../components/Dashboard/ScoreCard';
import CategoryDistribution from '../components/Dashboard/CategoryDistribution';
import { getUserActivities } from '../services/activityService';

interface Activity {
  id: number;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string;
  data_fim: string;
  date_awarded: string;
}

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { competencyItems, getCompetenciesByCategory, getAllCategories } = useCompetency();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      loadUserActivities();
    }
  }, [currentUser]);

  const loadUserActivities = async (): Promise<void> => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');
      const data = await getUserActivities(currentUser.id);
      setActivities(data || []);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPoints = (): number => {
    return activities.reduce((total, activity) => total + (activity.quantity * activity.value), 0);
  };

  const calculateTotalActivities = (): number => {
    return activities.length;
  };

  const getThisMonthActivities = (): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.date_awarded);
      return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear;
    }).length;
  };

  const getCategoryDistribution = (): CategoryData[] => {
    const categories = getAllCategories();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return categories.map((category, index) => {
      const categoryCompetencies = getCompetenciesByCategory(category);
      const competencyIds = categoryCompetencies.map(comp => comp.id);
      
      const categoryActivities = activities.filter(activity => 
        competencyIds.includes(activity.competence_id)
      );
      
      const totalPoints = categoryActivities.reduce(
        (sum, activity) => sum + (activity.quantity * activity.value), 
        0
      );

      return {
        category,
        value: totalPoints,
        color: colors[index % colors.length]
      };
    }).filter(item => item.value > 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral das suas atividades RSC</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard
          title="Total de Pontos"
          value={calculateTotalPoints()}
          icon={
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="blue"
          subtitle="pontos"
        />

        <ScoreCard
          title="Total de Atividades"
          value={calculateTotalActivities()}
          icon={
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="green"
          subtitle="atividades"
        />

        <ScoreCard
          title="Atividades Este Mês"
          value={getThisMonthActivities()}
          icon={
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="yellow"
          subtitle="este mês"
        />
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistribution
          data={getCategoryDistribution()}
          title="Distribuição por Categoria"
        />

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Atividades Recentes
            </h3>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma atividade cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {activities
                  .slice(-5)
                  .reverse()
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.competence_id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date_awarded).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.quantity * activity.value} pts
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.quantity} × {activity.value}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
