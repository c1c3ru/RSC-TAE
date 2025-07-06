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

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
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

      {/* Feedback de sucesso melhorado */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold">Atividade registrada com sucesso!</h3>
              <p className="text-sm mt-1">Sua atividade foi enviada para análise e aparecerá no dashboard após aprovação.</p>
            </div>
          </div>
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
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Detalhes da Atividade</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div><b>{LABELS.criterio}:</b> {selectedItem.criterio}</div>
              <div><b>{LABELS.limiteMaximo}:</b> {selectedItem.pontuacaoMaxima ?? 'Sem limite'}</div>
              <div><b>{LABELS.documentoObrigatorio}:</b> {selectedItem.documentosComprobatorios}</div>
            </div>
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

        {/* Points Preview com explicação */}
        {selectedItem && formData.quantidade && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Pontuação Estimada
            </h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {calculatePoints().toFixed(2)} {LABELS.pontos}
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p><b>Cálculo:</b> {formData.quantidade} × {selectedItem.points_per_unit} pontos por {selectedItem.unit || 'unidade'}</p>
              {selectedItem.max_points && (
                <p><b>Limite máximo:</b> {selectedItem.max_points} pontos para esta atividade</p>
              )}
              <p className="text-xs mt-2">
                A pontuação final será calculada após análise e aprovação da atividade pelos avaliadores.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button com feedback visual */}
        <button
          type="submit"
          disabled={loading || !selectedItem}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            loading 
              ? 'bg-gray-400 text-white animate-pulse' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando atividade...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              {LABELS.registrarAtividade}
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default ActivityRegistration;