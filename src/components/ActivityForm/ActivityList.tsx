
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserActivities, deleteActivity } from '../../services/activityService';
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

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const ActivityList: React.FC<ActivityListProps> = ({ refreshTrigger }: ActivityListProps) => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'success' });

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
    const total = activities.reduce((total, activity) => total + (activity.quantity * activity.value), 0);
    return Math.round(total * 100) / 100; // Arredonda para 2 casas decimais
  };

  const getCompetencyTitle = (competenceId: string): string => {
    const competency = competencyItems.find(item => item.id === competenceId);
    return competency ? competency.title : competenceId;
  };

  const handleDeleteClick = (activity: Activity) => {
    setActivityToDelete(activity);
    setModalOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!activityToDelete?.id) return;

    setDeleteLoading(true);
    try {
      await deleteActivity(activityToDelete.id);
      setToast({ show: true, message: 'Atividade excluída com sucesso!', type: 'success' });
      // Recarregar atividades após exclusão
      await loadActivities();
    } catch (err) {
      console.error('Erro ao excluir atividade:', err);
      setToast({ show: true, message: 'Erro ao excluir atividade.', type: 'error' });
    } finally {
      setDeleteLoading(false);
      setModalOpen(false);
      setActivityToDelete(null);
      // Esconder toast após 3 segundos
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const handleCancelDelete = (): void => {
    setModalOpen(false);
    setActivityToDelete(null);
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
    <div className="bg-white shadow rounded-lg min-w-0">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 break-words">
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
            
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto min-w-0">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
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
                        {Math.round((activity.quantity * activity.value) * 100) / 100}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.data_inicio)} - {formatDate(activity.data_fim)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.date_awarded ? formatDate(activity.date_awarded) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteClick(activity)}
                          className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition-colors"
                          aria-label={`Excluir atividade ${getCompetencyTitle(activity.competence_id)}`}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards - Visible on mobile and tablet */}
            <div className="lg:hidden space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-w-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 break-words">
                          Competência
                        </h4>
                        <p className="text-sm text-gray-700 break-words">
                          {getCompetencyTitle(activity.competence_id)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteClick(activity)}
                        className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition-colors ml-2"
                        aria-label={`Excluir atividade ${getCompetencyTitle(activity.competence_id)}`}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Quantidade
                        </h4>
                        <p className="text-sm text-gray-900">{activity.quantity}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Valor Unitário
                        </h4>
                        <p className="text-sm text-gray-900">{activity.value}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Total
                      </h4>
                      <p className="text-sm font-semibold text-gray-900">
                        {Math.round((activity.quantity * activity.value) * 100) / 100}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Período
                      </h4>
                      <p className="text-sm text-gray-700">
                        {formatDate(activity.data_inicio)} - {formatDate(activity.data_fim)}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Data Cadastro
                      </h4>
                      <p className="text-sm text-gray-700">
                        {activity.date_awarded ? formatDate(activity.date_awarded) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fadeIn min-w-0">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 break-words">Confirmar exclusão</h3>
            <p className="mb-6 text-gray-600 break-words">
              Tem certeza que deseja excluir a atividade <b>{activityToDelete && getCompetencyTitle(activityToDelete.competence_id)}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de feedback */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white font-semibold animate-fadeIn ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ActivityList;
 