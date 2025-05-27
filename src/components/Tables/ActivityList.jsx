import React from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ActivityList = () => {
  const { activities, competencyItems, deleteActivity } = useCompetency();

  const getItemDetails = (itemId) => {
    // Primeiro tenta usar os detalhes já carregados na atividade (se vieram do join)
    // Caso contrário, busca nos competencyItems locais
    return competencyItems.find(item => item.id === itemId) || { titulo: 'Item não encontrado', unidadeMedida: 'unidades' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm('Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.')) {
      deleteActivity(activityId);
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Atividades</h2>
        <div className="text-center py-10 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2">Nenhuma atividade registrada.</p>
          <p className="text-sm">Registre suas atividades para visualizá-las aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Atividades</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período/Quantidade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontuação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity) => {
                const item = activity.itemCompetenciaDetails || getItemDetails(activity.itemCompetenciaId);
                return (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id && `${item.id}.`} {item.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.quantidade} {item.unidadeMedida || 'unidades'}
                      {/* Se houver datas, você pode adicioná-las aqui: */}
                      {/* {activity.dataInicio && activity.dataFim && ` (${formatDate(activity.dataInicio)} a ${formatDate(activity.dataFim)})`} */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
                      {activity.pontuacao.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          alert(`Funcionalidade de edição para a atividade ${activity.id} será implementada.`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Editar atividade"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir atividade"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;