import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration';
import { LABELS } from '../constants/texts';

const ActivityRegistrationPage = () => {
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState(null);
  
  // Extract category filter from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location]);
  
  // Padronizar categorias para usar os mesmos ids do banco/contexto
  const categories = [
    { id: 'Administrativas', name: 'Atividades Administrativas', color: 'blue' },
    { id: 'Experiência', name: 'Experiência Profissional', color: 'red' },
    { id: 'Formação', name: 'Formação Acadêmica', color: 'green' },
    { id: 'Formação Complementar', name: 'Formação Complementar', color: 'yellow' },
    { id: 'Produção Científica', name: 'Produção Científica', color: 'purple' },
    { id: 'Eventos', name: 'Participação em Eventos', color: 'orange' },
    { id: 'Ensino', name: 'Atividades de Ensino', color: 'gray' },
    { id: 'Outras Atividades', name: 'Outras Atividades', color: 'pink' }
  ];
  
  // Function to generate appropriate color classes based on category
  const getCategoryColorClasses = (categoryId, type) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
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
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        button: 'bg-gray-600 hover:bg-gray-700'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        button: 'bg-pink-600 hover:bg-pink-700'
      }
    };
    
    return colorMap[category.color][type];
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{LABELS.registrarAtividade}</h1>
      
      {/* Category filter tabs */}
      {categoryFilter && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg ${getCategoryColorClasses(categoryFilter, 'bg')} ${getCategoryColorClasses(categoryFilter, 'border')}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Categoria: {categories.find(cat => cat.id === categoryFilter)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {categoryFilter === 'Administrativas' && 'Inclui fiscalização de contratos, participação em comissões e atividades de gestão.'}
                  {categoryFilter === 'Experiência' && 'Inclui tempo de serviço, cargos e funções ocupadas.'}
                  {categoryFilter === 'Formação' && 'Inclui cursos, titulação acadêmica e certificações.'}
                  {categoryFilter === 'Formação Complementar' && 'Inclui cursos complementares, workshops, etc.'}
                  {categoryFilter === 'Produção Científica' && 'Inclui publicações, patentes e desenvolvimento de sistemas.'}
                  {categoryFilter === 'Eventos' && 'Inclui organização de eventos e participação em projetos.'}
                  {categoryFilter === 'Ensino' && 'Inclui orientações, tutorias e atividades de ensino.'}
                  {categoryFilter === 'Outras Atividades' && 'Inclui outras atividades não classificadas nas categorias anteriores.'}
                </p>
              </div>
              <button
                onClick={() => setCategoryFilter(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Remover filtro
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Category selection buttons (when no filter is selected) */}
      {!categoryFilter && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              className={`p-4 rounded-lg border ${getCategoryColorClasses(category.id, 'bg')} ${getCategoryColorClasses(category.id, 'border')} text-left transition-colors`}
              onClick={() => setCategoryFilter(category.id)}
            >
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.id === 'Administrativas' && 'Fiscalização, comissões e gestão'}
                {category.id === 'Experiência' && 'Tempo de serviço e funções'}
                {category.id === 'Formação' && 'Cursos e titulação acadêmica'}
                {category.id === 'Formação Complementar' && 'Cursos complementares, workshops, etc.'}
                {category.id === 'Produção Científica' && 'Publicações e patentes'}
                {category.id === 'Eventos' && 'Eventos e projetos'}
                {category.id === 'Ensino' && 'Orientações e ensino'}
                {category.id === 'Outras Atividades' && 'Outras atividades'}
              </p>
            </button>
          ))}
        </div>
      )}
      
      {/* Activity registration form */}
      <ActivityRegistration categoryFilter={categoryFilter} />
    </div>
  );
};

export default ActivityRegistrationPage;