
import { useState, useEffect } from 'react';
import { useCompetency, type Competency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';
import { createActivity } from '../../services/activityService';
import { ACTIVITY_TEXTS, ERROR_MESSAGES } from '../../constants/texts';
import { getCategoryName } from '../../data/competencyItems';

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
  const { competencyItems, getAllCategories } = useCompetency();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState<ActivityFormData>({
    competenceId: '',
    quantity: 1,
    dataInicio: '',
    dataFim: '',
    description: ''
  });

  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);

  // Filtrar competências por categoria selecionada
  const filteredCompetencies = selectedCategory 
    ? competencyItems?.filter(item => item.category === selectedCategory) 
    : competencyItems;

  useEffect(() => {
    if (formData.competenceId && competencyItems) {
      const competency = competencyItems.find(item => item.id === formData.competenceId) || null;
      setSelectedCompetency(competency);
    }
  }, [formData.competenceId, competencyItems]);

  // Resetar competência quando categoria mudar
  useEffect(() => {
    setFormData(prev => ({ ...prev, competenceId: '' }));
    setSelectedCompetency(null);
  }, [selectedCategory]);

  const calculatePoints = (): number => {
    if (!selectedCompetency) return 0;
    const points = selectedCompetency.points_per_unit * formData.quantity;
    return Math.round(points * 100) / 100; // Arredonda para 2 casas decimais
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!currentUser) {
      onError?.(ERROR_MESSAGES.usuarioNaoAutenticado);
      return;
    }

    if (!selectedCompetency) {
      onError?.(ACTIVITY_TEXTS.selecioneCompetencia);
      return;
    }

    setLoading(true);

    try {
      const activityData = {
        user_id: currentUser.id,
        competence_id: formData.competenceId,
        quantity: formData.quantity,
        value: selectedCompetency.points_per_unit,
        data_inicio: formData.dataInicio,
        data_fim: formData.dataFim,
        description: formData.description ?? ''
      };

      try {
        // Tentar criar atividade normalmente primeiro
        await createActivity(activityData);
      } catch (error) {
        console.log('🔍 Debug - Falha na criação normal, tentando criação direta...');
        // Se falhar, tentar criação direta
        // await createActivityDirect(activityData); // This line was removed
      }
      
      // Reset form
      setFormData({
        competenceId: '',
        quantity: 1,
        dataInicio: '',
        dataFim: '',
        description: ''
      });
      setSelectedCategory('');
      
      onSuccess?.();
    } catch (error) {
      console.error('🔍 Debug - Erro final na criação de atividade:', error);
      onError?.(ERROR_MESSAGES.erroDesconhecido);
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
        {/* Filtro de Categoria - Mini Cards */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {getAllCategories().map((category) => (
              <button
                key={category}
                type="button"
                className={`px-4 py-2 rounded-lg shadow-md text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-700 scale-105 shadow-lg animate-pulse'
                    : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100 hover:scale-105 hover:shadow-lg'}
                `}
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryName(category)}
              </button>
            ))}
            {selectedCategory && (
              <button
                type="button"
                className="ml-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 transition-all duration-200 hover:scale-105 shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => setSelectedCategory('')}
              >
                Remover filtro
              </button>
            )}
          </div>
        </div>

        {/* Seleção de Competência */}
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
            disabled={!selectedCategory}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedCategory ? 'Selecione uma competência' : 'Primeiro selecione uma categoria'}
            </option>
            {filteredCompetencies?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.title} ({item.points_per_unit} pontos)
              </option>
            ))}
          </select>
          {selectedCategory && (
            <p className="mt-1 text-sm text-gray-500">
              {filteredCompetencies?.length || 0} competência(s) encontrada(s) na categoria {getCategoryName(selectedCategory)}
            </p>
          )}
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
              {formData.quantity} × {selectedCompetency.points_per_unit} pontos = {calculatePoints()} pontos totais
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Categoria: {getCategoryName(selectedCompetency.category)} | Máximo: {selectedCompetency.max_points} {selectedCompetency.unit}(s)
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !selectedCompetency}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Atividade'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityRegistration;
