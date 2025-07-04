
import React from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';

const RSC_LEVELS = [
  { nivel: 'I', pontos: 10, itens: 2, escolaridade: 'Ensino fundamental incompleto' },
  { nivel: 'II', pontos: 20, itens: 3, escolaridade: 'Ensino fundamental completo' },
  { nivel: 'III', pontos: 25, itens: 4, escolaridade: 'Ensino médio ou técnico' },
  { nivel: 'IV', pontos: 30, itens: 5, escolaridade: 'Graduação' },
  { nivel: 'V', pontos: 52, itens: 8, escolaridade: 'Pós-graduação lato sensu (especialização)' },
  { nivel: 'VI', pontos: 75, itens: 12, escolaridade: 'Mestrado' }
];

const getEscolaridadeUsuario = (user) => {
  // Tenta pegar do campo cargo ou user_metadata
  return user?.user_metadata?.escolaridade || user?.user_metadata?.cargo || null;
};

const escolaridadeParaNivel = (escolaridade) => {
  if (!escolaridade) return 0;
  const map = [
    { nivel: 1, termos: ['fundamental incompleto'] },
    { nivel: 2, termos: ['fundamental completo'] },
    { nivel: 3, termos: ['médio', 'técnico'] },
    { nivel: 4, termos: ['graduação', 'superior'] },
    { nivel: 5, termos: ['especialização', 'pós-graduação', 'lato sensu'] },
    { nivel: 6, termos: ['mestrado'] }
  ];
  escolaridade = escolaridade.toLowerCase();
  for (let i = map.length - 1; i >= 0; i--) {
    if (map[i].termos.some(t => escolaridade.includes(t))) return map[i].nivel;
  }
  return 0;
};

const ScoreCard = () => {
  const { 
    totalScore, 
    activities,
    competencyItems
  } = useCompetency();
  const { currentUser } = useAuth();

  // Itens distintos do rol
  const itensDistintos = new Set(activities.map(a => a.itemCompetenciaId)).size;
  // Escolaridade do usuário
  const escolaridade = getEscolaridadeUsuario(currentUser);
  const nivelEscolaridade = escolaridadeParaNivel(escolaridade);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white transform transition-all duration-300 hover:scale-105 mb-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Pontuação Total</h2>
        <div className="text-6xl font-bold mb-4 animate-pulse">
          {totalScore.toFixed(1)}
        </div>
        <div className="text-blue-100 mb-6">
          de 100 pontos
        </div>
        {/* Níveis de RSC */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs">
          {RSC_LEVELS.map((rsc, idx, arr) => (
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
            style={{ width: `${Math.min((totalScore/100)*100, 100)}%` }}
          ></div>
        </div>
        <div className="text-blue-100">
          {((totalScore/100)*100).toFixed(1)}% do objetivo
        </div>
      </div>

      {/* Quadro de requisitos automáticos */}
      <div className="mt-8 bg-white bg-opacity-90 rounded-lg p-6 text-gray-800 shadow-inner">
        <h3 className="text-lg font-bold mb-4 text-blue-700">Requisitos para cada nível</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Nível</th>
                <th className="px-2 py-1 text-left">Pontuação</th>
                <th className="px-2 py-1 text-left">Itens distintos</th>
                <th className="px-2 py-1 text-left">Escolaridade</th>
                <th className="px-2 py-1 text-left">Apto?</th>
              </tr>
            </thead>
            <tbody>
              {RSC_LEVELS.map((nivel, idx) => {
                const atingiuPontuacao = totalScore >= nivel.pontos;
                const atingiuItens = itensDistintos >= nivel.itens;
                const atingiuEscolaridade = nivelEscolaridade >= (idx+1);
                const apto = atingiuPontuacao && atingiuItens && atingiuEscolaridade;
                return (
                  <tr key={nivel.nivel} className={apto ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-2 py-1 font-bold">RSC {nivel.nivel}</td>
                    <td className="px-2 py-1">{nivel.pontos} {atingiuPontuacao ? '✔️' : '❌'}</td>
                    <td className="px-2 py-1">{nivel.itens} {atingiuItens ? '✔️' : '❌'}</td>
                    <td className="px-2 py-1">{nivel.escolaridade} {atingiuEscolaridade ? '✔️' : '❌'}</td>
                    <td className="px-2 py-1 font-bold">{apto ? '✔️' : '❌'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!escolaridade && (
          <div className="mt-4 text-red-600 font-semibold">Por favor, atualize seu perfil com a escolaridade para validação completa dos requisitos.</div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
