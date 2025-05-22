import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import DocumentUploader from './DocumentUploader';

const ActivityRegistration = ({ categoryFilter }) => {
  // Use the competencyItems from context, assuming it's loaded from your local itemsData
  // If you later fetch all competence definitions from Supabase, this will still work
  const { competencyItems, registerActivity } = useCompetency();

  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
    description: '',
    documents: [] // This will hold URLs/paths after upload, or temporary file objects
  });
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double submissions

  // Filter items by category if provided.
  // Assuming `item.category` is the string like 'Administrativas'
  // and `categoryFilter` might be a string like 'Administrativas' as well.
  const filteredItems = categoryFilter
    ? competencyItems.filter(item => item.category === categoryFilter) // Use 'category' instead of 'categoria'
    : competencyItems;

  // Handle item selection
  const handleItemSelect = (itemId) => {
    // `itemId` is a string (e.g., 'CAT1-01'), so no parseInt needed here
    const selected = competencyItems.find(item => item.id === itemId);
    setSelectedItem(selected);
    setCalculatedPoints(0);
    // Reset form except for documents (though documents are also part of the reset after submit)
    setFormValues({
      ...formValues,
      startDate: '',
      endDate: '',
      quantity: 1,
      description: ''
    });
    setErrors({}); // Clear errors when a new item is selected
  };

  // Calculate points based on the selected item and form values
  const calculatePoints = () => {
    if (!selectedItem) return 0;

    let points = 0;

    // Use `selectedItem.type` for calculation type (from Supabase schema)
    // Use `selectedItem.points_per_unit` (from Supabase schema)
    // Use `selectedItem.unit` for unit (from Supabase schema)
    // Use `selectedItem.max_points` for max points (from Supabase schema)
    switch (selectedItem.type) { // Changed from `tipoCalculo` to `type`
      case 'MONTHS': { // Changed from 'tempo' to 'MONTHS'
        if (formValues.startDate && formValues.endDate) {
          const start = new Date(formValues.startDate);
          const end = new Date(formValues.endDate);

          if (end < start) return 0;

          // Calculate months between dates
          const months = (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

          points = months * selectedItem.points_per_unit; // Changed from `valorPonto` to `points_per_unit`
        }
        break;
      }
      case 'EVENTS': // Changed from 'quantidade' to 'EVENTS' (or other types that imply quantity)
      case 'HOURS': // Changed from 'cargaHoraria' to 'HOURS'
      case 'CREDITS': // Added as per your data
      case 'YEARS': // Added as per your data
      case 'OTHER_QUANTITY_BASED_TYPE': // Add other types if needed
      {
        // For quantity-based types, calculate based on `quantity` directly
        points = formValues.quantity * selectedItem.points_per_unit;
        break;
      }
      // If there are simple, fixed-point items, they'd fall here
      default:
        // If a competence type doesn't fit the above, maybe it's just `points_per_unit` itself (e.g., per occurrence)
        points = selectedItem.points_per_unit * formValues.quantity; // Assuming 1 unit for default
        break;
    }

    // Check if there's a maximum points limit for this item
    if (selectedItem.max_points && points > selectedItem.max_points) { // Changed from `pontuacaoMaxima` to `max_points`
      points = selectedItem.max_points;
    }

    return parseFloat(points.toFixed(1));
  };

  // Update calculated points when form values or selected item changes
  useEffect(() => {
    if (selectedItem) {
      const points = calculatePoints();
      setCalculatedPoints(points);
    }
  }, [formValues, selectedItem]); // Depend on relevant states

  // Handle form value changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle document upload (this will likely involve storing file paths/URLs in Supabase Storage)
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
      newErrors.item = 'Selecione um item de competência.';
    } else {
      // Validation based on the `type` property from the database
      if (selectedItem.type === 'MONTHS') { // Changed from 'tempo' to 'MONTHS'
        if (!formValues.startDate) newErrors.startDate = 'Data inicial obrigatória.';
        if (!formValues.endDate) newErrors.endDate = 'Data final obrigatória.';
        if (formValues.startDate && formValues.endDate && new Date(formValues.endDate) < new Date(formValues.startDate)) {
          newErrors.dateRange = 'A data final deve ser posterior à data inicial.';
        }
      }
    }

    if (!formValues.description) {
      newErrors.description = 'Descrição obrigatória.';
    }

    if (formValues.documents.length === 0) {
      newErrors.documents = 'Pelo menos um documento comprobatório é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => { // Made async
    e.preventDefault();
    setSuccess(false);
    setErrors({}); // Clear previous errors
    if (isSubmitting) return; // Prevent double submission

    if (!validateForm()) {
        console.log("Validation failed", errors); // Debugging
        return;
    }

    setIsSubmitting(true); // Set submitting state

    // The activityData needs to match the `newActivityEntry` structure
    // that `registerActivity` in CompetencyContext expects for `user_rsc` table.
    const activityData = {
      // `itemCompetenciaId` maps to `competence_id` in `user_rsc`
      itemCompetenciaId: selectedItem.id,
      // `pontuacao` maps to `value` in `user_rsc`
      pontuacao: calculatedPoints,
      // `descricao` maps to `observacoes` in `user_rsc` (or a new field if you add it)
      observacoes: formValues.description, // Mapping to `observacoes` as a place to store description
      status: 'pendente', // Default status

      // You might need to add specific fields to `user_rsc`
      // for startDate, endDate, quantity, and documents if you need to store them
      // as part of the user's specific activity instance.
      // For now, these are only used for `calculatedPoints` calculation.
      // If you want to store them, you'd add columns like `start_date`, `end_date`, `quantity_achieved`, `document_urls`
      // to the `user_rsc` table.
      // documents: formValues.documents.map(doc => doc.url), // Assuming DocumentUploader returns objects with `url`
    };

    console.log("Submitting activityData:", activityData); // Debugging

    const result = await registerActivity(activityData);

    if (result) {
      setSuccess(true);
      // Reset form after successful registration
      setSelectedItem(null);
      setFormValues({
        startDate: '',
        endDate: '',
        quantity: 1,
        description: '',
        documents: []
      });
      setCalculatedPoints(0);
      setErrors({}); // Clear errors
    } else {
      // Error handling is done in CompetencyContext, but you can add more specific UI feedback here
      // For now, the error message from context will show
    }

    setIsSubmitting(false); // Reset submitting state
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
            {/* Displaying `item.id` and `item.title` */}
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}. {item.title} {/* Use `item.title` from Supabase schema */}
              </option>
            ))}
          </select>
          {errors.item && <p className="text-red-500 text-xs italic mt-1">{errors.item}</p>}
        </div>

        {/* Selected item details */}
        {selectedItem && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{selectedItem.title}</h3> {/* Use `selectedItem.title` */}
            <p className="text-sm mb-2">Detalhes da competência aqui...</p> {/* Placeholder for description, if available */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Documentação necessária:</span>
                {/* Access validation rules from selectedItem.validation_rules.docs */}
                <p>{selectedItem.validation_rules?.docs?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Unidade de Medida:</span>
                <p>{selectedItem.unit}</p> {/* Use `selectedItem.unit` */}
              </div>
              <div>
                <span className="font-medium">Valor por Unidade:</span>
                <p>{selectedItem.points_per_unit} pontos</p> {/* Use `selectedItem.points_per_unit` */}
              </div>
              {selectedItem.max_points && (
                <div>
                  <span className="font-medium">Pontuação Máxima:</span>
                  <p>{selectedItem.max_points} pontos</p> {/* Use `selectedItem.max_points` */}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedItem && (
          <>
            {/* Dynamic fields based on calculation type */}
            {selectedItem.type === 'MONTHS' && ( // Changed from `tipoCalculo` to `type`
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

            {/* General quantity input for types that need it */}
            {(selectedItem.type === 'EVENTS' || selectedItem.type === 'HOURS' || selectedItem.type === 'CREDITS' || selectedItem.type === 'YEARS') && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  {selectedItem.type === 'HOURS' ? `Carga Horária (${selectedItem.unit})` : `Quantidade (${selectedItem.unit})`}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0" // Changed min to 0 as quantity can be 0 sometimes before user input
                  step={selectedItem.type === 'HOURS' ? '0.1' : '1'} // Allow decimals for hours
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
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                  disabled={isSubmitting} // Disable button during submission
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar Atividade'}
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