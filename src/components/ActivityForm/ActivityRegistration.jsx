import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import DocumentUploader from './DocumentUploader';

const ActivityRegistration = () => {
  const { competencyItems, registerActivity } = useCompetency();
  const [formData, setFormData] = useState({
    itemCompetenciaId: '',
    quantidade: 1,
    dataInicio: '',
    dataFim: '',
    observacoes: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Group competency items by category
  const groupedItems = competencyItems.reduce((acc, item) => {
    const category = item.category || 1;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categoryNames = {
    1: 'Atividades Administrativas',
    2: 'Experiência Profissional',
    3: 'Formação Acadêmica',
    4: 'Formação Complementar',
    5: 'Produção Científica',
    6: 'Outras Atividades'
  };

  useEffect(() => {
    if (formData.itemCompetenciaId) {
      const item = competencyItems.find(item => item.id === formData.itemCompetenciaId);
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  }, [formData.itemCompetenciaId, competencyItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePoints = () => {
    if (!selectedItem || !formData.quantidade) return 0;

    const calculatedPoints = parseFloat(formData.quantidade) * selectedItem.points_per_unit;
    return Math.min(calculatedPoints, selectedItem.max_points);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    try {
      await registerActivity({
        itemCompetenciaId: formData.itemCompetenciaId,
        quantidade: parseFloat(formData.quantidade),
        dataInicio: formData.dataInicio || null,
        dataFim: formData.dataFim || null,
        observacoes: formData.observacoes
      });

      setSuccess(true);
      setFormData({
        itemCompetenciaId: '',
        quantidade: 1,
        dataInicio: '',
        dataFim: '',
        observacoes: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error registering activity:', error);
      alert('Erro ao registrar atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nova Atividade</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          Atividade registrada com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Competency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a Competência
          </label>
          <select
            name="itemCompetenciaId"
            value={formData.itemCompetenciaId}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma competência...</option>
            {Object.entries(groupedItems).map(([category, items]) => (
              <optgroup key={category} label={categoryNames[category]}>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Competency Details */}
        {selectedItem && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">{selectedItem.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Tipo:</strong> {selectedItem.type}</p>
              <p><strong>Unidade:</strong> {selectedItem.unit}</p>
              <p><strong>Pontos por unidade:</strong> {selectedItem.points_per_unit}</p>
              <p><strong>Pontuação máxima:</strong> {selectedItem.max_points}</p>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade ({selectedItem?.unit || 'unidades'})
          </label>
          <input
            type="number"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleInputChange}
            min="0.1"
            step="0.1"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início
            </label>
            <input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Fim
            </label>
            <input
              type="date"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Informações adicionais sobre a atividade..."
          />
        </div>

        {/* Points Preview */}
        {selectedItem && formData.quantidade && (
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-sm font-medium text-blue-800">
              Pontuação estimada: {calculatePoints().toFixed(2)} pontos
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedItem}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Registrando...' : 'Registrar Atividade'}
        </button>
      </form>
    </div>
  );
};

export default ActivityRegistration;