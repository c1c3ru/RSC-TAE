import React, { useState } from 'react';
import { useCompetency } from '../../context/CompetencyContext';

const ActivityList = () => {
  const { activities, deleteActivity } = useCompetency();
  const [modalOpen, setModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteActivity(activityToDelete.id);
      setToast({ show: true, message: 'Atividade excluída com sucesso!', type: 'success' });
    } catch (err) {
      setToast({ show: true, message: 'Erro ao excluir atividade.', type: 'error' });
    } finally {
      setLoading(false);
      setModalOpen(false);
      setActivityToDelete(null);
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setActivityToDelete(null);
  };

  if (!activities.length) {
    return <div className="text-center text-gray-500 py-8">Nenhuma atividade registrada.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Minhas Atividades</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Categoria</th>
              <th className="px-4 py-2 text-left">Pontuação</th>
              <th className="px-4 py-2 text-left">Data</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id} className="border-b hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2">{activity.titulo}</td>
                <td className="px-4 py-2">{activity.categoria}</td>
                <td className="px-4 py-2">{activity.pontuacao}</td>
                <td className="px-4 py-2">{activity.dataInicio || '-'}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition-colors"
                    onClick={() => handleDeleteClick(activity)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmação */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja excluir a atividade <b>{activityToDelete?.titulo}</b>?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={handleCancel}
                disabled={loading}
              >Cancelar</button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleConfirmDelete}
                disabled={loading}
              >{loading ? 'Excluindo...' : 'Excluir'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de feedback */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white font-semibold animate-fadeIn ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ActivityList; 