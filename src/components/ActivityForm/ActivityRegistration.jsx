import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import DocumentUploader from './DocumentUploader';
import { LABELS } from '../../constants/texts';

const ActivityRegistration = ({ categoryFilter }) => {
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
  const [documents, setDocuments] = useState([]);
  const [documentError, setDocumentError] = useState('');

  // Group competency items by category (usar string)
  const groupedItems = competencyItems.reduce((acc, item) => {
    const category = item.category || 'Outras Atividades';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Ajustar categoryNames para usar as mesmas strings do banco
  const categoryNames = {
    'Administrativas': 'Atividades Administrativas',
    'Experiência': 'Experiência Profissional',
    'Formação': 'Formação Acadêmica',
    'Formação Complementar': 'Formação Complementar',
    'Produção Científica': 'Produção Científica',
    'Eventos': 'Participação em Eventos',
    'Ensino': 'Atividades de Ensino',
    'Outras Atividades': 'Outras Atividades'
  };

  // LOG: Mostrar competencyItems e seus campos category
  useEffect(() => {
    if (competencyItems && competencyItems.length) {
      console.log('competencyItems:', competencyItems);
      competencyItems.forEach(item => {
        console.log('Competência:', item.id, 'category:', item.category, 'type:', typeof item.category);
      });
    }
  }, [competencyItems]);

  // LOG: Mostrar groupedItems
  useEffect(() => {
    console.log('groupedItems:', groupedItems);
  }, [groupedItems]);

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

  const handleDocumentsChange = (newDocs) => {
    setDocuments(newDocs);
    setDocumentError('');
  };

  // Corrigir validação de documentos para o novo formato
  const validateDocuments = () => {
    if (!documents.length) {
      setDocumentError('É obrigatório anexar o documento comprobatório.');
      return false;
    }
    setDocumentError('');
    return true;
  };

  const calculatePoints = () => {
    if (!selectedItem || !formData.quantidade) return 0;

    const calculatedPoints = parseFloat(formData.quantidade) * selectedItem.points_per_unit;
    return Math.min(calculatedPoints, selectedItem.max_points);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDocuments()) return;
    if (!selectedItem) return;

    setLoading(true);
    try {
      await registerActivity({
        itemCompetenciaId: formData.itemCompetenciaId,
        quantidade: parseFloat(formData.quantidade),
        dataInicio: formData.dataInicio || null,
        dataFim: formData.dataFim || null,
        observacoes: formData.observacoes,
        documentosComprobatorios: documents // Adiciona os documentos ao registro
      });

      setSuccess(true);
      setFormData({
        itemCompetenciaId: '',
        quantidade: 1,
        dataInicio: '',
        dataFim: '',
        observacoes: ''
      });
      setDocuments([]); // Limpa os documentos após o registro

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error registering activity:', error);
      alert('Erro ao registrar atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorias a exibir no select
  const categoriasParaMostrar = categoryFilter ? [categoryFilter] : Object.keys(groupedItems);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{LABELS.registrarNovaAtividade}</h2>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md animate-fadeIn">
          Atividade registrada com sucesso!
        </div>
      )}
      {documentError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md animate-fadeIn">
          {documentError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de atividade */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.atividade}
          </label>
          <select
            name="itemCompetenciaId"
            value={formData.itemCompetenciaId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">{LABELS.selecioneUmaAtividade}</option>
            {categoriasParaMostrar.map(cat => (
              groupedItems[cat] && groupedItems[cat].length > 0 && (
                <optgroup key={cat} label={categoryNames[cat] || cat}>
                  {groupedItems[cat].map(item => (
                    <option key={item.id} value={item.id}>{item.titulo}</option>
                  ))}
                </optgroup>
              )
            ))}
          </select>
        </div>

        {/* Exibe detalhes do item selecionado */}
        {selectedItem && (
          <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="mb-2 text-sm text-gray-700"><b>{LABELS.criterio}:</b> {selectedItem.criterio}</div>
            <div className="mb-2 text-sm text-gray-700"><b>{LABELS.limiteMaximo}:</b> {selectedItem.pontuacaoMaxima ?? 'Sem limite'}</div>
            <div className="mb-2 text-sm text-gray-700"><b>{LABELS.documentoObrigatorio}:</b> {selectedItem.documentosComprobatorios}</div>
          </div>
        )}

        {/* Upload de documento obrigatório */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.documentoComprobatorio} <span className="text-red-500">*</span>
          </label>
          <DocumentUploader documents={documents} onDocumentsChange={handleDocumentsChange} />
          {documentError && <div className="text-red-600 text-sm mt-1">{documentError}</div>}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.quantidade} ({selectedItem?.unit || 'unidades'})
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
              {LABELS.dataInicio}
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
              {LABELS.dataFim}
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
            {LABELS.observacoes}
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={LABELS.informacoesAdicionaisSobreAtividade}
          />
        </div>

        {/* Points Preview */}
        {selectedItem && formData.quantidade && (
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="text-sm font-medium text-blue-800">
              {LABELS.pontuacaoEstimada}: {calculatePoints().toFixed(2)} {LABELS.pontos}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedItem}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${loading ? 'animate-pulse' : ''}`}
        >
          {loading ? 'Registrando...' : LABELS.registrarAtividade}
        </button>
      </form>
    </div>
  );
};

export default ActivityRegistration;