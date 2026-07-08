import React from 'react';

interface EducationLevel {
  id: string;
  name: string;
  description: string;
  required: boolean;
  documentType: string;
}

interface EducationValidationProps {
  userEducation: string;
  onEducationChange: (education: string) => void;
}

const EducationValidation: React.FC<EducationValidationProps> = ({
  userEducation,
  onEducationChange
}) => {
  // Estado showUpload foi removido

  const educationLevels: EducationLevel[] = [
    {
      id: 'fundamental-incompleto',
      name: 'Ensino Fundamental Incompleto',
      description: 'Comprovante de ensino fundamental incompleto',
      required: true,
      documentType: 'comprovante'
    },
    {
      id: 'fundamental-completo',
      name: 'Ensino Fundamental Completo',
      description: 'Diploma de ensino fundamental completo',
      required: true,
      documentType: 'diploma'
    },
    {
      id: 'medio-tecnico',
      name: 'Ensino Médio ou Técnico de Nível Médio',
      description: 'Diploma de ensino médio ou técnico de nível médio',
      required: true,
      documentType: 'diploma'
    },
    {
      id: 'graduacao',
      name: 'Graduação',
      description: 'Diploma de graduação',
      required: true,
      documentType: 'diploma'
    },
    {
      id: 'especializacao',
      name: 'Pós-Graduação Lato Sensu',
      description: 'Certificado de pós-graduação lato sensu',
      required: true,
      documentType: 'certificado'
    },
    {
      id: 'mestrado',
      name: 'Mestrado',
      description: 'Diploma de mestre',
      required: true,
      documentType: 'diploma'
    },
    {
      id: 'doutorado',
      name: 'Doutorado',
      description: 'Diploma de doutor',
      required: true,
      documentType: 'diploma'
    }
  ];

  const getMaxLevel = (education: string): string => {
    const levels = ['fundamental-incompleto', 'fundamental-completo', 'medio-tecnico', 'graduacao', 'especializacao', 'mestrado', 'doutorado'];
    const currentIndex = levels.indexOf(education);
    return currentIndex >= 0 ? levels[currentIndex] : 'fundamental-incompleto';
  };

  const getAvailableLevels = (): EducationLevel[] => {
    const maxLevel = getMaxLevel(userEducation);
    const levels = ['fundamental-incompleto', 'fundamental-completo', 'medio-tecnico', 'graduacao', 'especializacao', 'mestrado', 'doutorado'];
    const maxIndex = levels.indexOf(maxLevel);
    
    return educationLevels.slice(0, maxIndex + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 break-words">
        Validação de Escolaridade
      </h3>

      <div className="mb-6">
        <label htmlFor="education-select" className="block text-sm font-medium text-gray-700 mb-2">
          Nível de Escolaridade Atual
        </label>
        <select
          id="education-select"
          title="Nível de Escolaridade"
          aria-label="Nível de Escolaridade Atual"
          value={userEducation}
          onChange={(e) => onEducationChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione sua escolaridade</option>
          {educationLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>

      {userEducation && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              📋 Documentação Necessária
            </h4>
            <p className="text-sm text-blue-700 break-words">
              Para validar sua escolaridade, você precisa anexar o documento correspondente:
            </p>
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p className="text-sm font-medium text-blue-800 break-words">
                {educationLevels.find(l => l.id === userEducation)?.description}
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              🎯 Níveis RSC-TAE Disponíveis
            </h4>
            <div className="space-y-2">
              {getAvailableLevels().map((level) => (
                <div key={level.id} className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-sm text-green-700 break-words">{level.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">
              ⚠️ Importante
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li className="break-words">• A escolaridade é um requisito obrigatório para cada nível RSC-TAE</li>
              <li className="break-words">• Você só pode pleitear níveis compatíveis com sua escolaridade</li>
              <li className="break-words">• Documentos devem ser legíveis e autenticados quando necessário</li>
              <li className="break-words">• A validação é feita pela comissão responsável</li>
            </ul>
          </div>
        </div>
      )}

      {!userEducation && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 break-words">
            Selecione sua escolaridade para ver os níveis RSC-TAE disponíveis e os documentos necessários.
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationValidation; 