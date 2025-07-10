import React from 'react';

interface LevelRequirement {
  level: string;
  name: string;
  minPoints: number;
  minActivities: number;
  minCategories: number;
  requirements: string[];
  color: string;
  icon: string;
}

interface LevelRequirementsProps {
  userPoints: number;
  userActivities: number;
  userCategories: number;
}

const LevelRequirements: React.FC<LevelRequirementsProps> = ({ 
  userPoints, 
  userActivities, 
  userCategories 
}) => {
  const levels: LevelRequirement[] = [
    {
      level: 'E',
      name: 'Nível Superior',
      minPoints: 15,
      minActivities: 3,
      minCategories: 3,
      requirements: [
        'Mínimo de 3 atividades em diferentes categorias',
        'Pelo menos 1 atividade de Produção Científica',
        'Pelo menos 1 atividade de Formação Acadêmica',
        'Total mínimo de 15 pontos'
      ],
      color: 'bg-purple-500',
      icon: '🎓'
    },
    {
      level: 'D',
      name: 'Nível Médio/Técnico',
      minPoints: 10,
      minActivities: 2,
      minCategories: 2,
      requirements: [
        'Mínimo de 2 atividades em diferentes categorias',
        'Pelo menos 1 atividade de Formação Acadêmica ou Complementar',
        'Total mínimo de 10 pontos'
      ],
      color: 'bg-blue-500',
      icon: '📚'
    },
    {
      level: 'C',
      name: 'Nível Médio',
      minPoints: 5,
      minActivities: 1,
      minCategories: 1,
      requirements: [
        'Mínimo de 1 atividade em qualquer categoria',
        'Total mínimo de 5 pontos'
      ],
      color: 'bg-green-500',
      icon: '📖'
    }
  ];

  const checkLevelEligibility = (level: LevelRequirement): {
    isEligible: boolean;
    progress: number;
    missingRequirements: string[];
  } => {
    const missingRequirements: string[] = [];
    let progress = 0;
    let totalChecks = 0;

    // Verificar pontos mínimos
    totalChecks++;
    if (userPoints >= level.minPoints) {
      progress++;
    } else {
      missingRequirements.push(`Pontos insuficientes (${userPoints}/${level.minPoints})`);
    }

    // Verificar atividades mínimas
    totalChecks++;
    if (userActivities >= level.minActivities) {
      progress++;
    } else {
      missingRequirements.push(`Atividades insuficientes (${userActivities}/${level.minActivities})`);
    }

    // Verificar categorias mínimas
    totalChecks++;
    if (userCategories >= level.minCategories) {
      progress++;
    } else {
      missingRequirements.push(`Categorias insuficientes (${userCategories}/${level.minCategories})`);
    }

    return {
      isEligible: progress === totalChecks,
      progress: (progress / totalChecks) * 100,
      missingRequirements
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Requisitos por Nível de Classificação
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((level) => {
          const eligibility = checkLevelEligibility(level);
          
          return (
            <div 
              key={level.level}
              className={`relative rounded-lg p-6 border-2 transition-all duration-300 ${
                eligibility.isEligible 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute -top-3 -right-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  eligibility.isEligible ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {eligibility.isEligible ? '✓' : '?'}
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl mr-3 ${level.color}`}>
                  {level.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Nível {level.level}
                  </h4>
                  <p className="text-sm text-gray-600">{level.name}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso</span>
                  <span>{eligibility.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      eligibility.isEligible ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${eligibility.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-800 text-sm">Requisitos:</h5>
                <ul className="space-y-1">
                  {level.requirements.map((req, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-green-500 mr-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Seus pontos: <span className="font-semibold">{userPoints}</span></div>
                  <div>Suas atividades: <span className="font-semibold">{userActivities}</span></div>
                  <div>Suas categorias: <span className="font-semibold">{userCategories}</span></div>
                </div>
              </div>

              {/* Missing Requirements */}
              {!eligibility.isEligible && eligibility.missingRequirements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h6 className="text-xs font-semibold text-red-600 mb-2">Faltando:</h6>
                  <ul className="space-y-1">
                    {eligibility.missingRequirements.map((req, index) => (
                      <li key={index} className="text-xs text-red-600 flex items-start">
                        <span className="text-red-500 mr-1">⚠</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Informações Adicionais */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ Informações Importantes</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Você pode registrar mais atividades do que o mínimo necessário</li>
          <li>• Atividades são aprovadas pela comissão antes da pontuação final</li>
          <li>• Documentos comprobatórios são obrigatórios para todas as atividades</li>
          <li>• O sistema calcula automaticamente sua elegibilidade para cada nível</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelRequirements; 