
import React from 'react';
import { useCompetency } from '../../context/CompetencyContext';

const ScoreCard = () => {
  const { 
    totalScore, 
    nextProgressionScore, 
    getProgressPercentage,
    getActivityStats 
  } = useCompetency();

  const progressPercentage = getProgressPercentage();
  const stats = getActivityStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pontuação Total</h2>
      
      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {totalScore.toFixed(1)}
        </div>
        <div className="text-sm text-gray-500">
          de {nextProgressionScore} pontos
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="text-sm text-gray-600 text-center mb-4">
        {progressPercentage.toFixed(1)}% do objetivo
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-xs text-gray-500">Aprovadas</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
