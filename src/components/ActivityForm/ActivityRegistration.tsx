
import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';
import { createActivity } from '../../services/activityService';

interface ActivityFormData {
  competenceId: string;
  quantity: number;
  dataInicio: string;
  dataFim: string;
  description?: string;
}

interface ActivityRegistrationProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ActivityRegistration: React.FC<ActivityRegistrationProps> = ({ onSuccess, onError }) => {
  const { competencyItems } = useCompetency();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ActivityFormData>({
    competenceId: '',
    quantity: 1,
    dataInicio: '',
    dataFim: '',
    description: ''
  });

  const [selectedCompetency, setSelectedCompetency] = useState<any>(null);

  useEffect(() => {
    if (formData.competenceId && competencyItems) {
      const competency = competencyItems.find(item => item.id === formData.competenceId);
      setSelectedCompetency(competency);
    }
  }, [formData.competenceId, competencyItems]);

  const calculatePoints = (): number => {
    if (!selectedCompetency) return 0;
    return selectedCompetency.value * formData.quantity;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!currentUser) {
      onError?.('Usuário não autenticado');
      return;
    }

    if (!selectedCompetency) {
      onError?.('Selecione uma competência');
      return;
    }

    setLoading(true);

    try {
      const activityData = {
        user_id: currentUser.id,
        competence_id: formData.competenceId,
        quantity: formData.quantity,
        value: selectedCompetency.value,
        data_inicio: formData.dataInicio,
        data_fim: formData.dataFim,
        description: formData.description
      };

      await createActivity(activityData);
      
      // Reset form
      setFormData({
        competenceId: '',
        quantity: 1,
        dataInicio: '',
        dataFim: '',
        description: ''
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao cadastrar atividade:', error);
      onError?.(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Cadastrar Nova Atividade</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="competenceId" className="block text-sm font-medium text-gray-700">
            Competência
          </label>
          <select
            id="competenceId"
            name="competenceId"
            value={formData.competenceId}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma competência</option>
            {competencyItems?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.description} ({item.value} pontos)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantidade
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">
              Data de Fim
            </label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição (Opcional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva a atividade realizada..."
          />
        </div>

        {selectedCompetency && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-900">Resumo da Pontuação</h4>
            <p className="text-sm text-blue-700 mt-1">
              {formData.quantity} × {selectedCompetency.value} pontos = {calculatePoints()} pontos totais
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Atividade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityRegistration;
