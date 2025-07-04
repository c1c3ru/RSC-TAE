
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
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white transform transition-all duration-300 hover:scale-105">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Pontuação Total</h2>
        <div className="text-6xl font-bold mb-4 animate-pulse">
          {totalScore.toFixed(1)}
        </div>
        <div className="text-blue-100 mb-6">
          de {nextProgressionScore} pontos
        </div>
        {/* Níveis de RSC */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs">
          {[
            { nivel: 'I', pontos: 0 },
            { nivel: 'II', pontos: 100 },
            { nivel: 'III', pontos: 200 },
            { nivel: 'IV', pontos: 300 },
            { nivel: 'V', pontos: 400 },
            { nivel: 'VI', pontos: 500 }
          ].map((rsc, idx, arr) => (
            <React.Fragment key={rsc.nivel}>
              <span className={`px-2 py-1 rounded font-semibold ${totalScore >= rsc.pontos && (idx === arr.length-1 || totalScore < arr[idx+1].pontos) ? 'bg-white text-blue-800 border border-blue-400' : 'bg-blue-200 bg-opacity-30 text-white border border-blue-300'}`}>RSC {rsc.nivel} <span className="font-normal">({rsc.pontos})</span></span>
              {idx < arr.length-1 && <span className="text-blue-200">→</span>}
            </React.Fragment>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-blue-300 bg-opacity-30 rounded-full h-4 mt-6 mb-4">
          <div 
            className="bg-white h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
          ></div>
        </div>
        <div className="text-blue-100">
          {getProgressPercentage().toFixed(1)}% do objetivo
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
