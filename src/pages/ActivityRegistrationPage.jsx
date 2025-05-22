import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration'; // This component will contain the main form logic

const ActivityRegistrationPage = () => {
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState(null);
  
  // Define categories with IDs and colors for mapping
  const categories = [
    { id: 1, name: 'Atividades Administrativas', color: 'blue', description: 'Fiscalização de contratos, participação em comissões e atividades de gestão.' },
    { id: 2, name: 'Experiência Profissional', color: 'red', description: 'Tempo de serviço, cargos e funções ocupadas.' },
    { id: 3, name: 'Formação e Capacitação', color: 'green', description: 'Cursos, titulação acadêmica e certificações.' },
    { id: 4, name: 'Produção Científica', color: 'yellow', description: 'Publicações, patentes e desenvolvimento de sistemas.' },
    { id: 5, name: 'Participação em Eventos', color: 'purple', description: 'Organização de eventos e participação em projetos.' },
    { id: 6, name: 'Atividades de Ensino', color: 'orange', description: 'Orientações, tutorias e atividades de ensino.' },
  ];

  // Effect to extract category filter from URL on component mount or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    // Ensure the category is a valid number and corresponds to an existing category
    if (category && categories.some(cat => cat.id === parseInt(category))) {
      setCategoryFilter(category);
    } else {
      setCategoryFilter(null); // Clear invalid or non-existent category filters
    }
  }, [location, categories]);

  // Function to determine CSS classes based on category color
  const getCategoryColorClasses = useCallback((categoryId, type) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    if (!category) return ''; // Return empty string if category not found

    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        button: 'bg-red-600 hover:bg-red-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    
    // Default to a neutral color if the specific color is not mapped
    return colorMap[category.color]?.[type] || '';
  }, [categories]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar Nova Atividade</h1>
      
      {/* Dynamic Category Filter Display / Selection */}
      {categoryFilter ? (
        <div className="mb-8">
          <div className={`p-6 rounded-xl shadow-lg ${getCategoryColorClasses(categoryFilter, 'bg')} ${getCategoryColorClasses(categoryFilter, 'border')} border-2`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Categoria Selecionada: {categories.find(cat => cat.id === parseInt(categoryFilter))?.name}
                </h3>
                <p className="text-md text-gray-600 mt-2">
                  {categories.find(cat => cat.id === parseInt(categoryFilter))?.description}
                </p>
              </div>
              <button
                onClick={() => setCategoryFilter(null)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Remover Filtro
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {categories.map(category => (
            <button
              key={category.id}
              className={`p-6 rounded-xl border-2 shadow-md text-left transition-all transform hover:scale-[1.02] ${getCategoryColorClasses(category.id, 'bg')} ${getCategoryColorClasses(category.id, 'border')}`}
              onClick={() => setCategoryFilter(category.id.toString())}
            >
              <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      )}
      
      {/* Activity Registration Form Component */}
      <ActivityRegistration categoryFilter={categoryFilter} />
    </div>
  );
};

export default ActivityRegistrationPage;