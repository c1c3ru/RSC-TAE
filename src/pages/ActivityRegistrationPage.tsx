
import React, { useState } from 'react';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration';
import ActivityList from '../components/ActivityForm/ActivityList';
import Lottie from 'lottie-react';
import activitiesAnimation from '../assets/lottie/activities_registration_animation.json';

const ActivityRegistrationPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSuccess = (): void => {
    setSuccessMessage('Atividade cadastrada com sucesso!');
    setErrorMessage('');
    setRefreshTrigger(prev => prev + 1);
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleError = (error: string): void => {
    setErrorMessage(error);
    setSuccessMessage('');
    
    // Clear error message after 5 seconds
    setTimeout(() => setErrorMessage(''), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <Lottie animationData={activitiesAnimation} style={{ width: 180, height: 180 }} />
        <h1 className="text-2xl font-bold text-gray-900">Cadastro de Atividades</h1>
        <p className="text-gray-600">Registre suas atividades de Reconhecimento de Saberes e Competências</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Registration Form */}
      <ActivityRegistration
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {/* Activity List */}
      <ActivityList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default ActivityRegistrationPage;
