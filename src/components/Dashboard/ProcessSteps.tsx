import React from 'react';
import { PROCESS_STEPS_TEXTS } from '../../constants/texts';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  details: readonly string[];
}

interface ProcessStepsProps {
  currentStep: number;
  userPoints: number;
  userActivities: number;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ 
  currentStep, 
  userPoints, 
  userActivities 
}) => {
  const steps: ProcessStep[] = [
    {
      id: 1,
      title: PROCESS_STEPS_TEXTS.etapas.cadastro.titulo,
      description: PROCESS_STEPS_TEXTS.etapas.cadastro.descricao,
      icon: '👤',
      status: userActivities > 0 ? 'completed' : 'current',
      details: PROCESS_STEPS_TEXTS.etapas.cadastro.detalhes
    },
    {
      id: 2,
      title: PROCESS_STEPS_TEXTS.etapas.registro.titulo,
      description: PROCESS_STEPS_TEXTS.etapas.registro.descricao,
      icon: '📝',
      status: userActivities > 0 ? 'completed' : 'pending',
      details: PROCESS_STEPS_TEXTS.etapas.registro.detalhes
    },
    {
      id: 3,
      title: PROCESS_STEPS_TEXTS.etapas.classificacao.titulo,
      description: PROCESS_STEPS_TEXTS.etapas.classificacao.descricao,
      icon: '🏆',
      status: 'pending',
      details: PROCESS_STEPS_TEXTS.etapas.classificacao.detalhes
    }
  ];

  const getStepStatus = (step: ProcessStep): 'completed' | 'current' | 'pending' => {
    if (step.id < currentStep) return 'completed';
    if (step.id === currentStep) return 'current';
    return 'pending';
  };

  const getStatusColor = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-blue-500 border-blue-500';
      case 'pending':
        return 'bg-gray-300 border-gray-300';
    }
  };

  const getStatusText = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return PROCESS_STEPS_TEXTS.status.concluido;
      case 'current':
        return PROCESS_STEPS_TEXTS.status.emAndamento;
      case 'pending':
        return PROCESS_STEPS_TEXTS.status.pendente;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 break-words">
        {PROCESS_STEPS_TEXTS.titulo}
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          
          return (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`absolute left-5 sm:left-6 top-10 sm:top-12 w-0.5 h-12 sm:h-16 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}

              <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                status === 'completed' 
                  ? 'border-green-200 bg-green-50' 
                  : status === 'current'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                {/* Step Number */}
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg ${getStatusColor(status)}`}>
                  {status === 'completed' ? '✓' : step.id}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center break-words">
                      <span className="mr-2 text-xl sm:text-2xl flex-shrink-0">{step.icon}</span>
                      {step.title}
                    </h4>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : status === 'current'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getStatusText(status)}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 mb-3 break-words">{step.description}</p>

                  {/* Step Details */}
                  <div className="space-y-2">
                    <h5 className="text-xs sm:text-sm font-semibold text-gray-800">Detalhes:</h5>
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-xs text-gray-600 flex items-start">
                          <span className={`mr-1 flex-shrink-0 ${
                            status === 'completed' ? 'text-green-500' : 'text-gray-400'
                          }`}>•</span>
                          <span className="break-words">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress Info */}
                  {step.id === 2 && userActivities > 0 && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <div className="text-xs sm:text-sm font-medium text-green-800">
                        ✅ {userActivities} {PROCESS_STEPS_TEXTS.progresso.atividadesRegistradas}
                      </div>
                      <div className="text-xs text-green-700">
                        {PROCESS_STEPS_TEXTS.progresso.totalPontos}: {Math.round(userPoints * 10) / 10}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* Tips */}
      <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-xs sm:text-sm font-semibold text-yellow-800 mb-2 break-words">
          {PROCESS_STEPS_TEXTS.dicas.titulo}
        </h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          {PROCESS_STEPS_TEXTS.dicas.itens.map((dica, index) => (
            <li key={index} className="break-words">• {dica}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProcessSteps; 