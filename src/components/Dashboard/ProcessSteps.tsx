import React from 'react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  details: string[];
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
      title: 'Cadastro e Perfil',
      description: 'Criar conta e completar perfil com dados pessoais',
      icon: '👤',
      status: userActivities > 0 ? 'completed' : 'current',
      details: [
        'Cadastro com email institucional',
        'Preenchimento de dados pessoais',
        'Confirmação de email',
        'Configuração inicial do perfil'
      ]
    },
    {
      id: 2,
      title: 'Registro de Atividades',
      description: 'Cadastrar atividades acadêmicas e profissionais',
      icon: '📝',
      status: userActivities > 0 ? 'completed' : 'pending',
      details: [
        'Seleção de categoria de atividade',
        'Escolha da competência específica',
        'Preenchimento de dados da atividade',
        'Upload de documentos comprobatórios',
        'Cálculo automático de pontuação'
      ]
    },
    {
      id: 3,
      title: 'Classificação Final',
      description: 'Receber classificação baseada na pontuação total',
      icon: '🏆',
      status: 'pending',
      details: [
        'Cálculo da pontuação final',
        'Verificação de requisitos mínimos',
        'Determinação do nível de classificação',
        'Emissão do certificado RSC-TAE'
      ]
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
        return 'Concluído';
      case 'current':
        return 'Em andamento';
      case 'pending':
        return 'Pendente';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Etapas do Processo RSC-TAE
      </h3>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          
          return (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}

              <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                status === 'completed' 
                  ? 'border-green-200 bg-green-50' 
                  : status === 'current'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                {/* Step Number */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getStatusColor(status)}`}>
                  {status === 'completed' ? '✓' : step.id}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="mr-2 text-2xl">{step.icon}</span>
                      {step.title}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : status === 'current'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getStatusText(status)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{step.description}</p>

                  {/* Step Details */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-gray-800">Detalhes:</h5>
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-xs text-gray-600 flex items-start">
                          <span className={`mr-1 ${
                            status === 'completed' ? 'text-green-500' : 'text-gray-400'
                          }`}>•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress Info */}
                  {step.id === 2 && userActivities > 0 && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <div className="text-sm font-medium text-green-800">
                        ✅ {userActivities} atividade(s) registrada(s)
                      </div>
                      <div className="text-xs text-green-700">
                        Total de pontos: {userPoints.toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">📊 Resumo do Progresso</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <span className="font-medium">Atividades registradas:</span> {userActivities}
          </div>
          <div>
            <span className="font-medium">Pontos acumulados:</span> {userPoints.toFixed(1)}
          </div>
          <div>
            <span className="font-medium">Etapa atual:</span> {currentStep} de {steps.length}
          </div>
          <div>
            <span className="font-medium">Progresso geral:</span> {Math.round((currentStep / steps.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">💡 Dicas Importantes</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Mantenha seus documentos organizados para facilitar o upload</li>
          <li>• Registre atividades assim que forem concluídas</li>
          <li>• Verifique os requisitos mínimos para cada nível</li>
          <li>• O processo pode levar algumas semanas para aprovação</li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessSteps; 