import React from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';

const ScoreCard = () => {
  // Desestrutura totalScore, progressionLevels e lastCalculationDate
  const { totalScore, progressionLevels, lastCalculationDate } = useCompetency();
  const { currentUser } = useAuth();
  
  // Encontra o nível atual e o próximo nível
  // currentLevel: o nível mais alto cujo scoreTarget é menor ou igual ao totalScore
  const currentLevel = progressionLevels.slice().reverse().find(level => totalScore >= level.scoreTarget);
  // nextLevel: o primeiro nível cujo scoreTarget é maior que o totalScore
  const nextLevel = progressionLevels.find(level => totalScore < level.scoreTarget);

  // Calcula a meta para a barra de progresso
  // Se houver um próximo nível, a meta é o scoreTarget desse próximo nível.
  // Se não houver um próximo nível (já atingiu o nível máximo), a meta é o scoreTarget do último nível.
  const targetForProgressBar = nextLevel ? nextLevel.scoreTarget : progressionLevels[progressionLevels.length - 1].scoreTarget;
  
  // Calcula a porcentagem de progresso em relação à meta (próximo nível ou nível máximo)
  // Evita divisão por zero se o targetForProgressBar for 0.
  const progressPercentage = targetForProgressBar > 0 
    ? Math.min((totalScore / targetForProgressBar) * 100, 100)
    : (totalScore > 0 ? 100 : 0); // Se o target for 0 e score > 0, já está 100% (ex: Nível I)

  /**
   * Formata uma string de data para exibição no formato localizado.
   * @param {string} dateString - A string de data a ser formatada.
   * @returns {string} A data formatada ou 'N/A' se a string for vazia.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-700 text-white p-4">
        <h3 className="text-lg font-semibold">Pontuação Total</h3>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div 
            className="text-4xl font-bold text-blue-700 transition-all duration-500 ease-out"
            key={totalScore} 
          >
            {totalScore.toFixed(1)}
          </div>
          <div 
            className="bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-3 py-1"
            title="Pontuação necessária para a próxima etapa da progressão funcional."
          >
            {/* Exibe o nível atual. Se não houver, mostra 'Nível Inicial' */}
            {currentLevel ? currentLevel.level : 'Nível Inicial'}
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 my-4 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          {/* Mensagem de progresso para o próximo nível ou de conclusão */}
          {nextLevel ? (
            `Faltam ${(nextLevel.scoreTarget - totalScore).toFixed(1)} pontos para o ${nextLevel.level}`
          ) : (
            'Parabéns! Você atingiu o nível máximo de progressão.'
          )}
        </div>
        
        {/* Detalhes do usuário */}
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Servidor</p>
              <p className="font-medium">{currentUser?.nome || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Matrícula</p>
              <p className="font-medium">{currentUser?.matricula || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Cargo</p>
              <p className="font-medium">{currentUser?.cargo || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Último cálculo</p>
              <p className="font-medium">{formatDate(lastCalculationDate || new Date())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
