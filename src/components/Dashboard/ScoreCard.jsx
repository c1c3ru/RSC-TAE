import React from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';

const ScoreCard = () => {
  const { totalScore, nextProgressionScore } = useCompetency();
  const { currentUser } = useAuth();
  
  // Calculate progress percentage with caps at 100%
  const progressPercentage = Math.min((totalScore / nextProgressionScore) * 100, 100);
  
  // Format dates
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
          <div className="text-4xl font-bold text-blue-700">{totalScore.toFixed(1)}</div>
          <div className="bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-3 py-1">
            Meta: {nextProgressionScore} pontos
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 my-4 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          {progressPercentage < 100 
            ? `Faltam ${(nextProgressionScore - totalScore).toFixed(1)} pontos para a próxima progressão`
            : 'Pontuação suficiente para a progressão!'}
        </div>
        
        {/* User details */}
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
              <p className="font-medium">{formatDate(new Date())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;