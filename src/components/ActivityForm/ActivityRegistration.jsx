import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';

const ActivityRegistration = ({ categoryFilter }) => {
  const { competencyItems, registerActivity, error: competencyError } = useCompetency();
  const { currentUser } = useAuth();

  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    quantity: 1,
    dataInicio: '', // Adicionado de volta para ser enviado para o DB
    dataFim: '', // Adicionado de volta para ser enviado para o DB
  });
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState(null); // Erro local para mensagens específicas do formulário

  const filteredItems = categoryFilter
    ? competencyItems.filter(item => item.categoria === parseInt(categoryFilter))
    : competencyItems;

  const handleItemSelect = (itemId) => {
    const selected = competencyItems.find(item => item.id === itemId);
    setSelectedItem(selected);
    setCalculatedPoints(0);
    setErrors({}); // Limpa erros ao mudar de item
    setFormValues({
      quantity: 1,
      dataInicio: '',
      dataFim: '',
    });
  };

  const calculatePoints = () => {
    if (!selectedItem) return 0;

    let points = 0;
    const quantity = parseFloat(formValues.quantity);

    if (isNaN(quantity) || quantity < 0) { // Quantidade pode ser 0 em alguns casos, mas não negativa
      return 0;
    }

    const valorPonto = parseFloat(selectedItem.valorPonto) || 0;
    const tipoCalculo = selectedItem.tipoCalculo;
    const unidadeBase = parseFloat(selectedItem.unidadeBase) || 1; // Garante que unidadeBase seja número

    switch (tipoCalculo) {
      case 'tempo': // Ex: meses
      case 'MONTHS':
        points = quantity * valorPonto;
        break;
      case 'quantidade': // Ex: certificações, eventos
      case 'EVENTS':
      case 'YEARS':
      case 'CREDITS':
        points = quantity * valorPonto;
        break;
      case 'cargaHoraria': // Ex: horas de curso
      case 'HOURS':
        // Carga horária é dividida pela unidade base antes de multiplicar pelos pontos por unidade
        points = (quantity / unidadeBase) * valorPonto;
        break;
      default:
        points = quantity * valorPonto;
    }

    // Aplica pontuação máxima
    if (selectedItem.pontuacaoMaxima !== null && selectedItem.pontuacaoMaxima !== undefined && points > selectedItem.pontuacaoMaxima) {
      points = selectedItem.pontuacaoMaxima;
    }

    return parseFloat(points.toFixed(1));
  };

  useEffect(() => {
    if (selectedItem) {
      const points = calculatePoints();
      setCalculatedPoints(points);
    }
  }, [formValues.quantity, selectedItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedItem) {
      newErrors.item = 'Selecione um item de competência.';
    }

    const quantity = parseFloat(formValues.quantity);
    if (isNaN(quantity) || quantity < 0) { // Quantidade pode ser 0, dependendo da regra de negócio
      newErrors.quantity = 'Quantidade deve ser um número não negativo.';
    }

    // Validações adicionais baseadas no tipo de cálculo ou regras específicas do item
    if (selectedItem) {
      if (selectedItem.tipoCalculo === 'tempo' || selectedItem.tipoCalculo === 'HOURS') {
        if (!formValues.dataInicio) {
          newErrors.dataInicio = 'Data de início é obrigatória para este tipo de atividade.';
        }
        if (!formValues.dataFim) {
          newErrors.dataFim = 'Data de fim é obrigatória para este tipo de atividade.';
        }
        if (formValues.dataInicio && formValues.dataFim && new Date(formValues.dataInicio) > new Date(formValues.dataFim)) {
          newErrors.dataFim = 'Data de fim não pode ser anterior à data de início.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLocalError(null);

    if (!validateForm()) {
      return;
    }

    const activityData = {
      itemCompetenciaId: selectedItem.id,
      quantidade: parseFloat(formValues.quantity),
      dataInicio: formValues.dataInicio || null,
      dataFim: formValues.dataFim || null,
      pontuacao: calculatedPoints,
    };

    const registered = await registerActivity(activityData);

    if (registered) {
      setSelectedItem(null);
      setFormValues({
        quantity: 1,
        dataInicio: '',
        dataFim: '',
      });
      setCalculatedPoints(0);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setLocalError(competencyError); // Usa o erro do contexto se houver
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Registrar Nova Atividade</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">Atividade registrada com sucesso!</span>
        </div>
      )}
      {localError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{localError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
        
        {selectedItem && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{selectedItem.titulo}</h3>
            <p className="text-sm mb-2">{selectedItem.descricao}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              
              <div>
                <span className="font-medium">Unidade de Medida:</span>
                <p>{selectedItem.unidadeMedida}</p>
              </div>
              <div>
                <span className="font-medium">Valor por Unidade:</span>
                <p>{selectedItem.valorPonto} pontos</p>
              </div>
              {selectedItem.pontuacaoMaxima !== null && selectedItem.pontuacaoMaxima !== undefined && (
                <div>
                  <span className="font-medium">Pontuação Máxima:</span>
                  <p>{selectedItem.pontuacaoMaxima} pontos</p>
                </div>
              )}
               {selectedItem.unidadeBase !== null && selectedItem.unidadeBase !== undefined && selectedItem.tipoCalculo === 'cargaHoraria' && (
                <div>
                  <span className="font-medium">Unidade Base (Carga Horária):</span>
                  <p>{selectedItem.unidadeBase} horas</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {selectedItem && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                Quantidade ({selectedItem.unidadeMedida || 'unidades'})
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                step="any"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.quantity ? 'border-red-500' : ''}`}
                value={formValues.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && <p className="text-red-500 text-xs italic mt-1">{errors.quantity}</p>}
            </div>

            {/* Campos de Data de Início e Fim - Renderização Condicional */}
            {(selectedItem.tipoCalculo === 'tempo' || selectedItem.tipoCalculo === 'HOURS') && (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataInicio">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.dataInicio ? 'border-red-500' : ''}`}
                    value={formValues.dataInicio}
                    onChange={handleInputChange}
                  />
                  {errors.dataInicio && <p className="text-red-500 text-xs italic mt-1">{errors.dataInicio}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataFim">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    id="dataFim"
                    name="dataFim"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.dataFim ? 'border-red-500' : ''}`}
                    value={formValues.dataFim}
                    onChange={handleInputChange}
                  />
                  {errors.dataFim && <p className="text-red-500 text-xs italic mt-1">{errors.dataFim}</p>}
                </div>
              </>
            )}

            
            {/* Exibição de pontos calculados */}
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