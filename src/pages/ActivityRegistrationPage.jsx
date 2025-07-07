import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration';
import { LABELS } from '../constants/texts';
import { useLottie } from 'lottie-react';
import activitiesAnimation from '/assets/lottie/activities_registration_animation.json';

const ActivityRegistrationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState(null);
  const { View } = useLottie({
    animationData: activitiesAnimation,
    loop: true,
    autoplay: true
  });
  
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
    <div className="container mx-auto px-4 pt-24">
      {/* Header com título e animação lado a lado */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{LABELS.registrarAtividade}</h1>
          <p className="text-gray-600 max-w-2xl">
            Registre suas atividades acadêmicas e profissionais para acumular pontos no sistema de competências. 
            Cada atividade possui critérios específicos de pontuação baseados em sua relevância e impacto.
          </p>
        </div>
        <div className="w-32 h-32 mt-4 lg:mt-0 flex-shrink-0">
          {View}
        </div>
      </div>

      {/* Seção informativa sobre o sistema de pontuação */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Como funciona o sistema de pontuação?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-indigo-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-indigo-800">Critérios de Pontuação</h3>
                <p className="text-sm text-indigo-700">Cada atividade possui um valor específico por unidade (hora, mês, documento, etc.)</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-indigo-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-indigo-800">Requisitos Mínimos por Nível</h3>
                <p className="text-sm text-indigo-700">Cada nível de classificação possui requisitos mínimos específicos</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-indigo-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-indigo-800">Cálculo Automático</h3>
                <p className="text-sm text-indigo-700">O sistema calcula automaticamente: Quantidade × Pontos por unidade</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-indigo-600 text-sm font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-medium text-indigo-800">Aprovação Necessária</h3>
                <p className="text-sm text-indigo-700">Todas as atividades passam por análise antes de serem contabilizadas</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-indigo-100 rounded-md">
          <p className="text-sm text-indigo-800">
            <strong>Exemplo:</strong> Se uma atividade vale 0.5 pontos por mês e você trabalhou 6 meses, 
            você receberá 3 pontos (6 × 0.5).
          </p>
        </div>
      </div>

      {/* Seção informativa sobre requisitos mínimos por nível */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Requisitos Mínimos por Nível de Classificação
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Nível E - Superior */}
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Nível E (Superior)
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Mínimo de 3 atividades em diferentes categorias</li>
              <li>• Pelo menos 1 atividade de Produção Científica</li>
              <li>• Pelo menos 1 atividade de Formação Acadêmica</li>
              <li>• Total mínimo de 15 pontos</li>
            </ul>
          </div>

          {/* Nível D - Médio/Técnico */}
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Nível D (Médio/Técnico)
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Mínimo de 2 atividades em diferentes categorias</li>
              <li>• Pelo menos 1 atividade de Formação Acadêmica ou Complementar</li>
              <li>• Total mínimo de 10 pontos</li>
            </ul>
          </div>

          {/* Nível C - Médio */}
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Nível C (Médio)
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Mínimo de 1 atividade em qualquer categoria</li>
              <li>• Total mínimo de 5 pontos</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-sm text-green-800">
            <strong>Importante:</strong> Estes são os requisitos mínimos para cada nível. Você pode registrar mais atividades 
            para aumentar sua pontuação total e melhorar sua classificação.
          </p>
        </div>
      </div>
      
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