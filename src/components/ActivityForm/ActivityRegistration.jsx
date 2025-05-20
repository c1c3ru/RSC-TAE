import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import DocumentUploader from './DocumentUploader';

const ActivityRegistration = ({ categoryFilter }) => {
  const { competencyItems, registerActivity } = useCompetency();
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
    description: '',
    documents: []
  });
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  // Filter items by category if provided
  const filteredItems = categoryFilter 
    ? competencyItems.filter(item => item.categoria === parseInt(categoryFilter))
    : competencyItems;
  
  // Handle item selection
  const handleItemSelect = (itemId) => {
    const selected = competencyItems.find(item => item.id === parseInt(itemId));
    setSelectedItem(selected);
    setCalculatedPoints(0);
    // Reset form except for documents
    setFormValues({
      ...formValues,
      startDate: '',
      endDate: '',
      quantity: 1,
      description: ''
    });
  };
  
  // Calculate points based on the selected item and form values
  const calculatePoints = () => {
    if (!selectedItem) return 0;
    
    let points = 0;
    
    switch (selectedItem.tipoCalculo) {
      case 'tempo': {
        // Calculate based on time period
        if (formValues.startDate && formValues.endDate) {
          const start = new Date(formValues.startDate);
          const end = new Date(formValues.endDate);
          
          if (end < start) return 0;
          
          // Calculate months between dates
          const months = (end.getFullYear() - start.getFullYear()) * 12 + 
            (end.getMonth() - start.getMonth());
            
          points = months * selectedItem.valorPonto;
        }
        break;
      }
      case 'quantidade': {
        // Calculate based on quantity
        points = formValues.quantity * selectedItem.valorPonto;
        break;
      }
      case 'cargaHoraria': {
        // Calculate based on workload (hours)
        points = (formValues.quantity / selectedItem.unidadeBase) * selectedItem.valorPonto;
        break;
      }
      default:
        points = selectedItem.valorPonto;
    }
    
    // Check if there's a maximum points limit for this item
    if (selectedItem.pontuacaoMaxima && points > selectedItem.pontuacaoMaxima) {
      points = selectedItem.pontuacaoMaxima;
    }
    
    return parseFloat(points.toFixed(1));
  };
  
  // Update calculated points when form values or selected item changes
  useEffect(() => {
    if (selectedItem) {
      const points = calculatePoints();
      setCalculatedPoints(points);
    }
  }, [formValues, selectedItem]);
  
  // Handle form value changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  // Handle document upload
  const handleDocumentsChange = (documents) => {
    setFormValues({
      ...formValues,
      documents
    });
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedItem) {
      newErrors.item = 'Selecione um item de competência';
    }
    
    if (selectedItem?.tipoCalculo === 'tempo') {
      if (!formValues.startDate) newErrors.startDate = 'Data inicial obrigatória';
      if (!formValues.endDate) newErrors.endDate = 'Data final obrigatória';
      if (formValues.startDate && formValues.endDate && new Date(formValues.endDate) < new Date(formValues.startDate)) {
        newErrors.dateRange = 'A data final deve ser posterior à data inicial';
      }
    }
    
    if (!formValues.description) {
      newErrors.description = 'Descrição obrigatória';
    }
    
    if (formValues.documents.length === 0) {
      newErrors.documents = 'Pelo menos um documento comprobatório é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    
    if (!validateForm()) return;
    
    const activityData = {
      itemCompetenciaId: selectedItem.id,
      dataInicio: formValues.startDate || null,
      dataFim: formValues.endDate || null,
      quantidade: formValues.quantity,
      descricao: formValues.description,
      documentos: formValues.documents,
      pontuacao: calculatedPoints,
      status: 'pendente'
    };
    
    registerActivity(activityData);
    
    // Reset form
    setSelectedItem(null);
    setFormValues({
      startDate: '',
      endDate: '',
      quantity: 1,
      description: '',
      documents: []
    });
    setCalculatedPoints(0);
    setSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Registrar Nova Atividade</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">Atividade registrada com sucesso!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Item selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="competencyItem">
            Item de Competência
          </label>
          <select
            id="competencyItem"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.item ? 'border-red-500' : ''}`}
            value={selectedItem?.id || ''}
            onChange={(e) => handleItemSelect(e.target.value)}
          >
            <option value="">Selecione um item</option>
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}. {item.titulo}
              </option>
            ))}
          </select>
          {errors.item && <p className="text-red-500 text-xs italic mt-1">{errors.item}</p>}
        </div>
        
        {/* Selected item details */}
        {selectedItem && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{selectedItem.titulo}</h3>
            <p className="text-sm mb-2">{selectedItem.descricao}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Documentação necessária:</span>
                <p>{selectedItem.documentosComprobatorios}</p>
              </div>
              <div>
                <span className="font-medium">Unidade de Medida:</span>
                <p>{selectedItem.unidadeMedida}</p>
              </div>
              <div>
                <span className="font-medium">Valor por Unidade:</span>
                <p>{selectedItem.valorPonto} pontos</p>
              </div>
              {selectedItem.pontuacaoMaxima && (
                <div>
                  <span className="font-medium">Pontuação Máxima:</span>
                  <p>{selectedItem.pontuacaoMaxima} pontos</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {selectedItem && (
          <>
            {/* Dynamic fields based on calculation type */}
            {selectedItem.tipoCalculo === 'tempo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.startDate ? 'border-red-500' : ''}`}
                    value={formValues.startDate}
                    onChange={handleInputChange}
                  />
                  {errors.startDate && <p className="text-red-500 text-xs italic mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                    Data Final
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.endDate ? 'border-red-500' : ''}`}
                    value={formValues.endDate}
                    onChange={handleInputChange}
                  />
                  {errors.endDate && <p className="text-red-500 text-xs italic mt-1">{errors.endDate}</p>}
                </div>
              </div>
            )}
            
            {(selectedItem.tipoCalculo === 'quantidade' || selectedItem.tipoCalculo === 'cargaHoraria') && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  {selectedItem.tipoCalculo === 'cargaHoraria' ? 'Carga Horária (horas)' : 'Quantidade'}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  step={selectedItem.tipoCalculo === 'cargaHoraria' ? '0.1' : '1'}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formValues.quantity}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            {/* Description field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Descrição da Atividade
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Descreva detalhes sobre a atividade..."
                value={formValues.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
            </div>
            
            {/* Document uploader */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Documentos Comprobatórios
              </label>
              <DocumentUploader 
                documents={formValues.documents} 
                onDocumentsChange={handleDocumentsChange} 
              />
              {errors.documents && <p className="text-red-500 text-xs italic mt-1">{errors.documents}</p>}
              <p className="text-xs text-gray-500 mt-2">
                Documentos aceitos: PDF, PNG, JPG (máx. 5MB por arquivo)
              </p>
            </div>
            
            {/* Calculated points display */}
            <div className="mb-6 flex items-center">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pontuação Calculada
                </label>
                <div className="bg-gray-100 px-3 py-2 rounded border border-gray-300">
                  <span className="text-lg font-bold text-blue-700">{calculatedPoints.toFixed(1)}</span> pontos
                </div>
              </div>
              <div className="ml-4">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Registrar Atividade
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ActivityRegistration;