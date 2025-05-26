import React, { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUser } from '../../utils/supabaseClient'; 
import DocumentUploader from './DocumentUploader'; 

const ActivityRegistrationSupabase = ({ categoryFilter }) => {
  const [competencyItems, setCompetencyItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({
    startDate: '',
    endDate: '',
    quantity: 1,
    description: '', 
    documents: [] // Inicializado como array vazio
  });
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUserState] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser(); // getCurrentUser já lida com supabase null
        setCurrentUserState(user);
        if (!user && supabase) { // Só mostra erro de auth se supabase estiver ok mas user não
          setErrors(prev => ({ ...prev, auth: 'Usuário não autenticado. Faça login para registrar atividades.' }));
        }
      } catch (e) {
        console.error("Erro ao buscar usuário:", e);
        setErrors(prev => ({ ...prev, auth: 'Erro ao verificar autenticação.' }));
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!supabase) {
        setErrors(prev => ({ ...prev, fetch: 'Cliente Supabase não inicializado.' }));
        setIsLoading(false);
        return;
    }
    const fetchCompetencies = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('competences')
        .select('*');

      if (error) {
        console.error('Error fetching competencies:', error);
        setErrors(prev => ({ ...prev, fetch: 'Falha ao carregar os itens de competência.' }));
        setCompetencyItems([]);
      } else {
        setCompetencyItems(data || []);
      }
      setIsLoading(false);
    };

    fetchCompetencies();
  }, []);

  const filteredItems = categoryFilter && competencyItems.length > 0
    ? competencyItems.filter(item => item.category === categoryFilter) // Assumindo que categoryFilter é string como item.category
    : competencyItems;

  const handleItemSelect = (itemId) => {
    const selected = competencyItems.find(item => item.id === itemId); // item.id é string
    setSelectedItem(selected);
    setCalculatedPoints(0);
    setFormValues(prev => ({
      ...prev,
      startDate: '',
      endDate: '',
      quantity: 1,
      description: '',
      documents: Array.isArray(prev.documents) ? prev.documents : [] // Garante que documents permaneça array
    }));
    setErrors({}); 
  };

  const calculatePoints = useCallback(() => {
    if (!selectedItem) return 0;

    let points = 0;
    const pointsPerUnit = parseFloat(selectedItem.points_per_unit);
    const maxPoints = selectedItem.max_points ? parseFloat(selectedItem.max_points) : null;

    switch (selectedItem.type) {
      case 'tempo': {
        if (formValues.startDate && formValues.endDate) {
          const start = new Date(formValues.startDate);
          const end = new Date(formValues.endDate);
          if (end < start) return 0;
          const months = (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
          points = months * pointsPerUnit;
        }
        break;
      }
      case 'quantidade':
      case 'cargaHoraria': { 
        points = parseFloat(formValues.quantity) * pointsPerUnit;
        break;
      }
      default: 
        points = pointsPerUnit; 
    }

    if (maxPoints !== null && points > maxPoints) {
      points = maxPoints;
    }

    return parseFloat(points.toFixed(1));
  }, [selectedItem, formValues.startDate, formValues.endDate, formValues.quantity]);

  useEffect(() => {
    if (selectedItem) {
      const points = calculatePoints();
      setCalculatedPoints(points);
    }
  }, [formValues, selectedItem, calculatePoints]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentsChange = (newDocuments) => {
    setFormValues(prev => ({
      ...prev,
      // Garante que newDocuments seja um array, ou usa um array vazio se não for.
      documents: Array.isArray(newDocuments) ? newDocuments : [] 
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentUser) {
        newErrors.auth = 'Você precisa estar logado para registrar uma atividade.';
    }
    if (!selectedItem) {
      newErrors.item = 'Selecione um item de competência.';
    }

    if (selectedItem?.type === 'tempo') {
      if (!formValues.startDate) newErrors.startDate = 'Data inicial é obrigatória.';
      if (!formValues.endDate) newErrors.endDate = 'Data final é obrigatória.';
      if (formValues.startDate && formValues.endDate && new Date(formValues.endDate) < new Date(formValues.startDate)) {
        newErrors.dateRange = 'A data final deve ser posterior à data inicial.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    if (!currentUser || !supabase) {
        setErrors(prev => ({ ...prev, auth: 'Usuário não encontrado ou Supabase não inicializado. Por favor, faça login.' }));
        setIsLoading(false);
        return;
    }

    // Garante que formValues.documents seja um array antes de usar .filter
    const safeDocuments = Array.isArray(formValues.documents) ? formValues.documents : [];
    const documentsToStore = safeDocuments
      .filter(doc => doc && doc.status === 'success') // Adiciona verificação para 'doc' existir
      .map(doc => ({
        nome: doc.nome,
        publicURL: doc.publicURL,
        storagePath: doc.storagePath,
        tipo: doc.tipo,
        tamanho: doc.tamanho,
        dataUpload: doc.dataUpload
      }));

    const dataToInsert = {
      user_id: currentUser.id,
      competence_id: selectedItem.id,
      achieved_points: calculatedPoints,
      date_awarded: formValues.startDate || new Date().toISOString().split('T')[0],
      value: 0, 
      quantity: null, 
    };

    if (selectedItem.type === 'tempo') {
      const start = new Date(formValues.startDate);
      const end = new Date(formValues.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      dataToInsert.value = months >= 0 ? months : 0;
      dataToInsert.quantity = 1;
    } else if (selectedItem.type === 'quantidade' || selectedItem.type === 'cargaHoraria') {
      dataToInsert.value = parseFloat(formValues.quantity) || 0;
      dataToInsert.quantity = parseFloat(formValues.quantity) || 0;
    } else { 
      dataToInsert.value = 1; 
      dataToInsert.quantity = 1;
    }
    
    if (formValues.description) {
        dataToInsert.description = formValues.description;
    }
    if (documentsToStore.length > 0) {
        dataToInsert.documents = documentsToStore; // Para coluna JSONB 'documents'
    }
    dataToInsert.status = 'pendente'; // Para coluna 'status'

    const { error: insertError } = await supabase
      .from('user_rsc')
      .insert([dataToInsert]);

    setIsLoading(false);

    if (insertError) {
      console.error('Error registering activity:', insertError);
      setErrors(prev => ({ ...prev, submit: `Falha ao registrar atividade: ${insertError.message}` }));
    } else {
      setSuccess(true);
      setSelectedItem(null);
      setFormValues({
        startDate: '',
        endDate: '',
        quantity: 1,
        description: '',
        documents: [] 
      });
      setCalculatedPoints(0);
      setErrors({});
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (isLoading && competencyItems.length === 0 && !errors.fetch) {
    return <div className="text-center p-6 text-gray-600">Carregando dados de competências...</div>;
  }
  
  if (errors.fetch) {
     return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto" role="alert"><strong>Erro:</strong> {errors.fetch}</div>;
  }
  if (!supabase) { // Verifica se o Supabase foi inicializado
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto" role="alert"><strong>Erro de Configuração:</strong> Cliente Supabase não está disponível. Verifique as variáveis de ambiente e a inicialização.</div>;
  }


  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Registrar Nova Atividade</h2>

      {errors.auth && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-md">{errors.auth}</p>}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md shadow-sm" role="alert">
          Atividade registrada com sucesso!
        </div>
      )}
      {errors.submit && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-md"><strong>Falha no Registro:</strong> {errors.submit}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="competencyItem">
            Item de Competência <span className="text-red-500">*</span>
          </label>
          <select
            id="competencyItem"
            className={`shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.item ? 'border-red-500' : 'border-gray-300'}`}
            value={selectedItem?.id || ''}
            onChange={(e) => handleItemSelect(e.target.value)}
            disabled={isLoading || competencyItems.length === 0}
          >
            <option value="">Selecione um item...</option>
            {filteredItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.title}
              </option>
            ))}
          </select>
          {errors.item && <p className="text-red-500 text-xs italic mt-1">{errors.item}</p>}
        </div>

        {selectedItem && (
          <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">{selectedItem.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Regras de Validação:</span>
                <p className="text-gray-600 text-xs break-words">{selectedItem.validation_rules ? JSON.stringify(selectedItem.validation_rules) : "Não especificadas"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Unidade de Medida:</span>
                <p className="text-gray-600">{selectedItem.unit || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Pontos por Unidade:</span>
                <p className="text-gray-600">{selectedItem.points_per_unit} pontos</p>
              </div>
              {selectedItem.max_points !== null && selectedItem.max_points !== undefined && (
                <div>
                  <span className="font-medium text-gray-700">Pontuação Máxima:</span>
                  <p className="text-gray-600">{selectedItem.max_points} pontos</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedItem && (
          <>
            {selectedItem.type === 'tempo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                    Data Inicial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date" id="startDate" name="startDate"
                    className={`shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.startDate || errors.dateRange ? 'border-red-500' : 'border-gray-300'}`}
                    value={formValues.startDate} onChange={handleInputChange}
                  />
                  {errors.startDate && <p className="text-red-500 text-xs italic mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                    Data Final <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date" id="endDate" name="endDate"
                    className={`shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.endDate || errors.dateRange ? 'border-red-500' : 'border-gray-300'}`}
                    value={formValues.endDate} onChange={handleInputChange}
                  />
                  {errors.endDate && <p className="text-red-500 text-xs italic mt-1">{errors.endDate}</p>}
                </div>
                {errors.dateRange && <p className="text-red-500 text-xs italic mt-1 md:col-span-2">{errors.dateRange}</p>}
              </div>
            )}

            {(selectedItem.type === 'quantidade' || selectedItem.type === 'cargaHoraria') && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  {selectedItem.type === 'cargaHoraria' ? `Carga Horária (${selectedItem.unit || 'horas'})` : `Quantidade (${selectedItem.unit || 'unidades'})`}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" id="quantity" name="quantity" min="0.1" step="0.1"
                  className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formValues.quantity} onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Descrição da Atividade 
              </label>
              <textarea
                id="description" name="description" rows="3"
                className={`shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Descreva detalhes sobre a atividade, se necessário..."
                value={formValues.description} onChange={handleInputChange}
              />
              {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Documentos Comprobatórios
              </label>
              <DocumentUploader
                documents={formValues.documents} // Passa o array (garantidamente)
                onDocumentsChange={handleDocumentsChange}
                userId={currentUser?.id} 
              />
              {errors.documents && <p className="text-red-500 text-xs italic mt-1">{errors.documents}</p>}
            </div>

            <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Pontuação Calculada Estimada
              </label>
              <div className="text-2xl font-bold text-indigo-600">
                {calculatedPoints.toFixed(1)} <span className="text-lg font-normal text-gray-600">pontos</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !selectedItem || !currentUser}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                    </div>
                ) : 'Registrar Atividade'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ActivityRegistrationSupabase;
