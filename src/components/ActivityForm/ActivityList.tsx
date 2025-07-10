
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserActivities } from '../../services/activityService';
import { competencyItems } from '../../data/competencyItems';

interface Activity {
  id?: number;
  competence_id: string;
  quantity: number;
  value: number;
  data_inicio: string;
  data_fim: string;
  date_awarded?: string;
  description?: string;
}

interface ActivityListProps {
  refreshTrigger?: number;
}

const ActivityList: React.FC<ActivityListProps> = ({ refreshTrigger }: ActivityListProps) => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadActivities();
  }, [currentUser, refreshTrigger]);

  const loadActivities = async (): Promise<void> => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');
      const data = await getUserActivities(currentUser.id);
      setActivities(data || []);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotalPoints = (): number => {
    return activities.reduce((total, activity) => total + (activity.quantity * activity.value), 0);
  };

  const getCompetencyTitle = (competenceId: string): string => {
    const competency = competencyItems.find(item => item.id === competenceId);
    return competency ? competency.title : competenceId;
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Atividades Cadastradas
        </h3>
        
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma atividade cadastrada ainda.
          </p>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                Total de pontos: {calculateTotalPoints()}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Competência
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Unitário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getCompetencyTitle(activity.competence_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {activity.quantity * activity.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.data_inicio)} - {formatDate(activity.data_fim)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.date_awarded ? formatDate(activity.date_awarded) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
 