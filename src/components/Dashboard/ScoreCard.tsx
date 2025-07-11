import * as React from 'react';
import { useAuth } from '../../context/AuthContext';

// Constantes de níveis RSC
const RSC_LEVELS = [
  { nivel: 'I', pontos: 10, itens: 2, escolaridade: 'Ensino fundamental incompleto' },
  { nivel: 'II', pontos: 20, itens: 3, escolaridade: 'Ensino fundamental completo' },
  { nivel: 'III', pontos: 25, itens: 4, escolaridade: 'Ensino médio ou técnico' },
  { nivel: 'IV', pontos: 30, itens: 5, escolaridade: 'Graduação' },
  { nivel: 'V', pontos: 52, itens: 8, escolaridade: 'Pós-graduação lato sensu (especialização)' },
  { nivel: 'VI', pontos: 75, itens: 12, escolaridade: 'Mestrado' }
];

interface ScoreCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  percentage?: number;
  maxValue?: number;
  userActivities?: number;
  userCategories?: number;
}

// Função utilitária para obter escolaridade do usuário
const getEscolaridadeUsuario = (user: any) => {
  return user?.user_metadata?.escolaridade || user?.user_metadata?.cargo || null;
};

// Função utilitária para mapear escolaridade para nível
const escolaridadeParaNivel = (escolaridade: string | null): number => {
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

// Subcomponente: Badge de nível RSC
const RSCLevelBadge: React.FC<{ rsc: any; idx: number; arr: any[]; totalScore: number }> = ({ rsc, idx, arr, totalScore }) => (
  <span className={`px-2 py-1 rounded font-semibold ${totalScore >= rsc.pontos && (idx === arr.length-1 || totalScore < arr[idx+1].pontos) ? 'bg-white text-blue-800 border border-blue-400' : 'bg-blue-200 bg-opacity-30 text-white border border-blue-300'}`}>
    RSC {rsc.nivel} <span className="font-normal">({rsc.pontos})</span>
  </span>
);

// Subcomponente: Tabela de requisitos
const RequisitosTable: React.FC<{ totalScore: number; itensDistintos: number; nivelEscolaridade: number; escolaridade: string | null }> = ({ totalScore, itensDistintos, nivelEscolaridade, escolaridade }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-blue-50">
          <th className="px-3 py-2 text-left font-semibold text-blue-800 border-b border-blue-200">Nível RSC</th>
          <th className="px-3 py-2 text-left font-semibold text-blue-800 border-b border-blue-200">Pontuação Mínima</th>
          <th className="px-3 py-2 text-left font-semibold text-blue-800 border-b border-blue-200">Itens Distintos</th>
          <th className="px-3 py-2 text-left font-semibold text-blue-800 border-b border-blue-200">Escolaridade Exigida</th>
          <th className="px-3 py-2 text-left font-semibold text-blue-800 border-b border-blue-200">Status</th>
        </tr>
      </thead>
      <tbody>
        {RSC_LEVELS.map((nivel, idx) => {
          const atingiuPontuacao = totalScore >= nivel.pontos;
          const atingiuItens = itensDistintos >= nivel.itens;
          const atingiuEscolaridade = nivelEscolaridade >= (idx+1);
          const apto = atingiuPontuacao && atingiuItens && atingiuEscolaridade;
  return (
            <tr key={nivel.nivel} className={`${apto ? 'bg-green-50 border-l-4 border-l-green-400' : 'bg-red-50 border-l-4 border-l-red-400'} hover:bg-opacity-75 transition-colors`}>
              <td className="px-3 py-3 font-bold text-gray-800">
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
                    RSC {nivel.nivel}
                  </span>
                  <span className="text-xs text-gray-500">(Nível {idx + 1})</span>
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center">
                  <span className="font-medium">{nivel.pontos} pontos</span>
                  <span className={`ml-2 text-lg ${atingiuPontuacao ? 'text-green-600' : 'text-red-600'}`}>{atingiuPontuacao ? '✔️' : '❌'}</span>
                </div>
              </td>
              <td className="px-3 py-3">
        <div className="flex items-center">
                  <span className="font-medium">{nivel.itens} itens</span>
                  <span className={`ml-2 text-lg ${atingiuItens ? 'text-green-600' : 'text-red-600'}`}>{atingiuItens ? '✔️' : '❌'}</span>
            </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center">
                  <span className="text-xs text-gray-600 max-w-32">{nivel.escolaridade}</span>
                  <span className={`ml-2 text-lg ${atingiuEscolaridade ? 'text-green-600' : 'text-red-600'}`}>{atingiuEscolaridade ? '✔️' : '❌'}</span>
          </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{apto ? 'APTO' : 'INAPTO'}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    {/* Alerta de escolaridade ausente */}
    {!escolaridade && (
      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-yellow-800 font-semibold">
            Por favor, atualize seu perfil com a escolaridade para validação completa dos requisitos.
          </span>
        </div>
                  </div>
                )}
  </div>
);

// Subcomponente: Legenda
const Legenda: React.FC = () => (
  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
    <p className="text-sm text-blue-800">
      <strong>📋 Legenda:</strong> Para ser classificado em um nível RSC, você deve atender TODOS os requisitos: pontuação mínima, quantidade de itens distintos e escolaridade exigida.
    </p>
  </div>
);

const ScoreCard: React.FC<ScoreCardProps> = React.memo(({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle,
  percentage,
  maxValue,
  userActivities = 0,
  userCategories = 0
}) => {
  const { currentUser } = useAuth();
  
  // Calcular percentual se não fornecido
  const calculatedPercentage = percentage !== undefined 
    ? percentage 
    : maxValue && typeof value === 'number' 
      ? (value / maxValue) * 100 
      : undefined;

  // Cálculo de itens distintos e escolaridade
  const itensDistintos = userActivities;
  const escolaridade = getEscolaridadeUsuario(currentUser);
  const nivelEscolaridade = escolaridadeParaNivel(escolaridade);
  const totalScore = typeof value === 'number' ? value : 0;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-10 text-white transform transition-all duration-300 hover:scale-105 mb-10">
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold mb-6">Pontuação Total</h2>
        <div className="text-7xl font-extrabold mb-6 animate-pulse drop-shadow-lg">
          {totalScore.toFixed(1)}
        </div>
        <div className="text-blue-100 mb-8 text-lg font-medium">de 100 pontos</div>
        
        {/* Explicação do sistema RSC */}
        <div className="mb-10 p-6 bg-blue-50 bg-opacity-60 rounded-lg shadow-inner">
          <p className="text-blue-900 text-base mb-2 font-semibold">
            <strong>Sistema de Classificação RSC (Registro de Saberes e Competências)</strong>
          </p>
          <p className="text-blue-800 text-sm">
            O sistema RSC classifica servidores em 6 níveis (I a VI) baseado em pontuação, quantidade de atividades distintas e escolaridade. Veja abaixo seus requisitos:
          </p>
        </div>
        
        {/* Níveis de RSC */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-base">
          {RSC_LEVELS.map((rsc, idx, arr) => (
            <React.Fragment key={rsc.nivel}>
              <RSCLevelBadge rsc={rsc} idx={idx} arr={arr} totalScore={totalScore} />
              {idx < arr.length-1 && <span className="text-blue-200 text-2xl">→</span>}
            </React.Fragment>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-blue-300 bg-opacity-30 rounded-full h-6 mt-10 mb-6">
          <div 
            className="bg-white h-6 rounded-full transition-all duration-1000 ease-out shadow"
            style={{ width: `${Math.min((totalScore/100)*100, 100)}%` }}
          ></div>
          </div>
        <div className="text-blue-100 text-lg font-semibold">
          {((totalScore/100)*100).toFixed(1)}% do objetivo
        </div>
      </div>
      
      {/* Quadro de requisitos automáticos */}
      <div className="mt-12 bg-white bg-opacity-95 rounded-2xl p-8 text-gray-800 shadow-xl space-y-8">
        <h3 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Requisitos para Classificação RSC
        </h3>
        <RequisitosTable totalScore={totalScore} itensDistintos={itensDistintos} nivelEscolaridade={nivelEscolaridade} escolaridade={escolaridade} />
        <Legenda />
      </div>
    </div>
  );
});

export default ScoreCard;