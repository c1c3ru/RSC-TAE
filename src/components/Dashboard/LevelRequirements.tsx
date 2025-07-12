import React from 'react';

interface LevelRequirement {
  level: string;
  name: string;
  minPoints: number;
  minItems: number;
  educationRequirement: string;
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
      level: 'VI',
      name: 'RSC-TAE VI (Doutorado)',
      minPoints: 75,
      minItems: 12,
      educationRequirement: 'Diploma de mestre',
      requirements: [
        'Diploma de mestre',
        'Mínimo de 75 pontos',
        'Distribuídos em no mínimo 12 itens do rol de saberes e competências'
      ],
      color: 'bg-purple-600',
      icon: '🎓'
    },
    {
      level: 'V',
      name: 'RSC-TAE V (Mestrado)',
      minPoints: 52,
      minItems: 8,
      educationRequirement: 'Certificado de pós-graduação lato sensu',
      requirements: [
        'Certificado de pós-graduação lato sensu',
        'Mínimo de 52 pontos',
        'Distribuídos em no mínimo 8 itens do rol de saberes e competências'
      ],
      color: 'bg-purple-500',
      icon: '📚'
    },
    {
      level: 'IV',
      name: 'RSC-TAE IV (Graduação)',
      minPoints: 30,
      minItems: 5,
      educationRequirement: 'Diploma de graduação',
      requirements: [
        'Diploma de graduação',
        'Mínimo de 30 pontos',
        'Distribuídos em no mínimo 5 itens do rol de saberes e competências'
      ],
      color: 'bg-blue-500',
      icon: '🎓'
    },
    {
      level: 'III',
      name: 'RSC-TAE III (Ensino Médio)',
      minPoints: 25,
      minItems: 4,
      educationRequirement: 'Diploma de ensino médio ou técnico de nível médio',
      requirements: [
        'Diploma de ensino médio ou técnico de nível médio',
        'Mínimo de 25 pontos',
        'Distribuídos em no mínimo 4 itens do rol de saberes e competências'
      ],
      color: 'bg-green-500',
      icon: '📖'
    },
    {
      level: 'II',
      name: 'RSC-TAE II (Fundamental Completo)',
      minPoints: 20,
      minItems: 3,
      educationRequirement: 'Diploma de ensino fundamental completo',
      requirements: [
        'Diploma de ensino fundamental completo',
        'Mínimo de 20 pontos',
        'Distribuídos em no mínimo 3 itens do rol de saberes e competências'
      ],
      color: 'bg-yellow-500',
      icon: '📝'
    },
    {
      level: 'I',
      name: 'RSC-TAE I (Fundamental Incompleto)',
      minPoints: 10,
      minItems: 2,
      educationRequirement: 'Comprovante de ensino fundamental incompleto',
      requirements: [
        'Comprovante de ensino fundamental incompleto',
        'Mínimo de 10 pontos',
        'Distribuídos em no mínimo 2 itens do rol de saberes e competências'
      ],
      color: 'bg-orange-500',
      icon: '📋'
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
      const pointsPercentage = Math.round((userPoints / level.minPoints) * 100 * 10) / 10;
      missingRequirements.push(`Pontos insuficientes (${pointsPercentage}%)`);
    }

    // Verificar itens mínimos (atividades)
    totalChecks++;
    if (userActivities >= level.minItems) {
      progress++;
    } else {
      const itemsPercentage = Math.round((userActivities / level.minItems) * 100 * 10) / 10;
      missingRequirements.push(`Itens insuficientes (${itemsPercentage}%)`);
    }

    return {
      isEligible: progress === totalChecks,
      progress: (progress / totalChecks) * 100,
      missingRequirements
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 break-words">
        Requisitos por Nível RSC-TAE
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {levels.map((level) => {
          const eligibility = checkLevelEligibility(level);
          
          return (
            <div 
              key={level.level}
              className={`relative rounded-lg p-4 sm:p-6 border-2 transition-all duration-300 ${
                eligibility.isEligible 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold ${
                  eligibility.isEligible ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {eligibility.isEligible ? '✓' : '?'}
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl mr-2 sm:mr-3 ${level.color}`}>
                  {level.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 break-words">
                    Nível {level.level}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{level.name}</p>
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
                      <span className="text-green-500 mr-1 flex-shrink-0">•</span>
                      <span className="break-words">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>



              {/* Missing Requirements */}
              {!eligibility.isEligible && eligibility.missingRequirements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h6 className="text-xs font-semibold text-red-600 mb-2">Faltando:</h6>
                  <ul className="space-y-1">
                    {eligibility.missingRequirements.map((req, index) => (
                      <li key={index} className="text-xs text-red-600 flex items-start">
                        <span className="text-red-500 mr-1 flex-shrink-0">⚠</span>
                        <span className="break-words">{req}</span>
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
          <li>• Você pode registrar mais itens do que o mínimo necessário</li>
          <li>• Itens são aprovados pela comissão antes da pontuação final</li>
          <li>• Documentos comprobatórios são obrigatórios para todos os itens</li>
          <li>• O sistema calcula automaticamente sua elegibilidade para cada nível</li>
          <li>• É necessário comprovar a escolaridade mínima para cada nível</li>
        </ul>
      </div>
    </div>
  );
};

export default LevelRequirements; 