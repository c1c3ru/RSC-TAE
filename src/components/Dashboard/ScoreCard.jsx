import React from 'react';
import { useCompetency } from '../../context/CompetencyContext'; // Ajuste o caminho se necessário
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho se necessário
// import { useNavigate } from 'react-router-dom'; // Descomente se for usar para navegação

const ProgressPanel = () => {
  const {
    totalScore = 0,
    nextProgressionScore = 1,
    lastCalculationDate,
    completedActivitiesGrouped = {},
    suggestedActivities = [],
    isLoading = false,
  } = useCompetency();
  const { currentUser } = useAuth();
  // const navigate = useNavigate();

  const rscTaeMilestones = [
    { name: 'RSC-TAE I', points: 25, color: 'bg-green-500' },
    { name: 'RSC-TAE II', points: 30, color: 'bg-yellow-500' },
    { name: 'RSC-TAE III', points: 52, color: 'bg-orange-500' },
    { name: 'RSC-TAE IV', points: 75, color: 'bg-red-500' },
  ];

  const effectiveNextProgressionScore = nextProgressionScore > 0 ? nextProgressionScore : (totalScore > 0 ? totalScore : 1);
  const progressPercentage = Math.min((totalScore / effectiveNextProgressionScore) * 100, 100);

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleRegisterActivity = (activityId) => {
    console.log("Redirecionar para cadastro da atividade:", activityId);
    // navigate(`/cadastro-atividade/${activityId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-gray-600">Carregando seu painel de progresso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* --- SEÇÃO 1: PONTUAÇÃO TOTAL E META --- */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5">
          <h3 className="text-xl font-semibold tracking-wide">Seu Progresso Atual</h3>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="mb-4 sm:mb-0">
              <div
                className="text-5xl font-bold text-blue-700 transition-all duration-500 ease-out"
                key={totalScore}
              >
                {totalScore.toFixed(1)} <span className="text-3xl text-gray-500">pontos</span>
              </div>
            </div>
            {nextProgressionScore > 0 && (
              <div
                className="bg-blue-50 border border-blue-200 text-blue-800 text-base font-medium rounded-lg px-4 py-2 shadow-sm"
                title="Pontuação necessária para a próxima etapa da progressão funcional."
              >
                Meta: {nextProgressionScore.toFixed(1)} pontos
              </div>
            )}
          </div>

          {/* Barra de progresso com marcos RSC-TAE */}
          {nextProgressionScore > 0 && (
            <div className="my-5">
              <div className="relative w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700 shadow-inner">
                {/* Barra de progresso do usuário */}
                <div
                  className="bg-blue-600 h-3.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                {/* Marcos RSC-TAE */}
                {rscTaeMilestones.map((milestone) => {
                  // Calcula a posição percentual do marco em relação à meta de progressão
                  // Garante que a posição não exceda 100% visualmente de forma simples,
                  // embora o cálculo possa ser > 100 se o marco for maior que a meta.
                  // Um marco posicionado a >100% pode não ser ideal visualmente sem tratamento CSS adicional.
                  const milestonePercentage = (milestone.points / effectiveNextProgressionScore) * 100;
                  // Para evitar que o marcador saia muito da barra, podemos limitar a 100% para o 'left',
                  // mas isso pode agrupar marcadores no final.
                  // A melhor abordagem visual pode depender do contexto.
                  // Aqui, permitimos que o cálculo seja > 100 e o CSS/layout determinará a visibilidade.

                  return (
                    <div
                      key={milestone.name}
                      className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${milestone.color} border-2 border-white shadow-md`}
                      style={{
                        left: `calc(${Math.min(milestonePercentage, 100)}% - 6px)`, // Subtrai metade da largura para centralizar
                         // Se milestonePercentage > 100, ele será posicionado fora da barra visível (à direita).
                         // Para "clampar" no final: left: milestonePercentage > 100 ? 'calc(100% - 12px)' : `calc(${milestonePercentage}% - 6px)`
                      }}
                      title={`${milestone.name}: ${milestone.points} pontos`}
                    >
                       {/* Pequeno ponto interno para melhor visualização */}
                       <div className="w-1 h-1 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  );
                })}
              </div>
              {/* Legenda para os marcos */}
              <div className="flex justify-around mt-2 text-xs text-gray-500 px-1">
                {rscTaeMilestones.map(milestone => (
                  <div key={`legend-${milestone.name}`} className="flex items-center" title={`${milestone.name}: ${milestone.points} pontos`}>
                    <span className={`w-2 h-2 rounded-full ${milestone.color} mr-1`}></span>
                    <span>{milestone.points}pts</span>
                  </div>
                ))}
              </div>
              <div className="text-md text-gray-600 mt-3 mb-6">
                {progressPercentage < 100
                  ? `Faltam ${(effectiveNextProgressionScore - totalScore).toFixed(1)} pontos para a próxima progressão.`
                  : 'Parabéns! Você atingiu a pontuação para a progressão!'}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Detalhes do Servidor</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <p className="text-gray-500">Nome:</p>
                <p className="font-medium text-gray-800">{currentUser?.nome || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-gray-500">Matrícula:</p>
                <p className="font-medium text-gray-800">{currentUser?.matricula || 'Não informada'}</p>
              </div>
              <div>
                <p className="text-gray-500">Cargo:</p>
                <p className="font-medium text-gray-800">{currentUser?.cargo || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-gray-500">Último Cálculo:</p>
                <p className="font-medium text-gray-800">{formatDate(lastCalculationDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO 2: DETALHAMENTO DA PONTUAÇÃO --- */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Detalhamento da Sua Pontuação</h3>
        </div>
        <div className="p-6 md:p-8">
          {Object.keys(completedActivitiesGrouped).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(completedActivitiesGrouped).map(([category, activities]) => (
                <div key={category}>
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">{category}</h4>
                  <ul className="space-y-2 pl-4 border-l-2 border-blue-200">
                    {activities.map(activity => (
                      <li key={activity.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{activity.name}</span>
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {activity.points.toFixed(1)} pts
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Você ainda não cadastrou nenhuma atividade.</p>
          )}
        </div>
      </div>

      {/* --- SEÇÃO 3: GUIA DE PRÓXIMOS PASSOS (SUGESTÕES) --- */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-teal-600 text-white p-5">
          <h3 className="text-xl font-semibold tracking-wide">Oportunidades para Você</h3>
          <p className="text-sm opacity-90">Sugestões de atividades para aumentar sua pontuação.</p>
        </div>
        <div className="p-6 md:p-8">
          {suggestedActivities.length > 0 ? (
            <div className="space-y-4">
              {suggestedActivities.map(activity => (
                <div key={activity.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h4 className="text-md font-semibold text-gray-800">{activity.name}</h4>
                      <p className="text-xs text-gray-500 mb-1 sm:mb-0">
                        Categoria: {activity.category} (+{activity.points.toFixed(1)} pts)
                      </p>
                    </div>
                    <button
                      onClick={() => handleRegisterActivity(activity.id)}
                      className="mt-2 sm:mt-0 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-300"
                    >
                      Cadastrar Atividade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Parabéns! Parece que você já realizou todas as atividades disponíveis ou não há sugestões no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPanel;
