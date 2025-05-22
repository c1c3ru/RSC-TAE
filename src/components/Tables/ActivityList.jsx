import React from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Componente ActivityList para exibir uma lista de atividades
const ActivityList = () => {
  // Desestrutura as atividades, itens de competência e a função deleteActivity do contexto de competência
  const { activities, competencyItems, deleteActivity } = useCompetency();

  /**
   * Retorna os detalhes de um item de competência com base no seu ID.
   * @param {number} itemId - O ID do item de competência.
   * @returns {object} O objeto do item de competência ou um objeto padrão se não for encontrado.
   */
  const getItemDetails = (itemId) => {
    return competencyItems.find(item => item.id === itemId) || { titulo: 'Item não encontrado' };
  };

  /**
   * Formata uma string de data para exibição no formato dd/MM/yyyy.
   * @param {string} dateString - A string de data a ser formatada.
   * @returns {string} A data formatada ou '-' se a string for vazia.
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Garante que a data é um objeto Date válido antes de formatar
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  /**
   * Componente de badge de status para exibir o status da atividade com cores.
   * @param {object} props - As propriedades do componente.
   * @param {string} props.status - O status da atividade (aprovada, pendente, rejeitada).
   * @returns {JSX.Element} Um elemento span com o estilo de badge.
   */
  const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = '';

    switch(status) {
      case 'aprovada':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'pendente':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'rejeitada':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium ${bgColor} ${textColor} rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  /**
   * Lida com a exclusão de uma atividade após a confirmação do usuário.
   * @param {string} activityId - O ID da atividade a ser excluída.
   */
  const handleDeleteActivity = (activityId) => {
    // Usar um modal personalizado para confirmação em vez de window.confirm para melhor UX
    // Por enquanto, usaremos window.confirm para funcionalidade básica
    if (window.confirm('Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.')) {
      deleteActivity(activityId);
    }
  };

  /**
   * Lida com a visualização de documentos.
   * @param {Array<object>} documents - A lista de documentos para visualizar.
   */
  const handleViewDocuments = (documents) => {
    if (documents.length === 0) {
      console.log('Nenhum documento para visualizar.');
      // Poderia exibir uma mensagem amigável no UI
      return;
    }
    // Implementar lógica para abrir um modal ou navegar para uma página de visualização de documentos
    console.log('Visualizando documentos:', documents);
    // Exemplo: window.open(documents[0].arquivo, '_blank'); // Abriria o primeiro documento em uma nova aba
    // Para múltiplos documentos, um modal com links seria ideal.
    alert(`Visualizando ${documents.length} documento(s). (Funcionalidade completa em breve)`);
  };

  // Exibe uma mensagem se não houver atividades registradas
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
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período/Quantidade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontuação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity) => {
                const item = getItemDetails(activity.itemCompetenciaId);
                return (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id && `${item.id}.`} {item.titulo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={activity.descricao}>
                      {activity.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.dataInicio ? (
                        <>
                          {formatDate(activity.dataInicio)} a {formatDate(activity.dataFim)}
                        </>
                      ) : (
                        `${activity.quantidade} ${item.unidadeMedida || 'unidades'}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
                      {activity.pontuacao.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={activity.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.documentos && activity.documentos.length > 0 ? (
                        <button
                          onClick={() => handleViewDocuments(activity.documentos)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title={`Ver ${activity.documentos.length} documento(s)`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zM11 6a1 1 0 10-2 0v5a1 1 0 002 0V6z" clipRule="evenodd" />
                          </svg>
                          ({activity.documentos.length})
                        </button>
                      ) : (
                        <span className="text-gray-400">Nenhum</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* Botão Editar - Implementar navegação para a página de edição */}
                      <button
                        onClick={() => {
                          // Exemplo: Redirecionar para a página de registro com os dados da atividade para edição
                          // navigate(`/activity/register?edit=${activity.id}`);
                          alert(`Funcionalidade de edição para a atividade ${activity.id} será implementada.`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Editar atividade"
                      >
                        Editar
                      </button>
                      {/* Botão Excluir */}
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