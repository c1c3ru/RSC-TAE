import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration';
import { useLottie } from 'lottie-react';
import activitiesAnimation from '../assets/lottie/activities_registration_animation.json';

const ActivityRegistrationPage = () => {
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { View } = useLottie({
    animationData: activitiesAnimation,
    loop: true,
    autoplay: true
  });

  // Garantir que View é um elemento React
  const renderLottieView = () => {
    return React.isValidElement(View) ? View : null;
  };
  
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
    { id: 'administrativas', name: 'Atividades Administrativas', description: 'Atividades relacionadas à gestão, organização e coordenação do ambiente acadêmico.', color: 'blue' },
    { id: 'experiencia', name: 'Atividades de Experiência', description: 'Atividades que visam a formação de competências práticas e habilidades técnicas.', color: 'red' },
    { id: 'formacao', name: 'Atividades de Formação', description: 'Atividades voltadas à formação acadêmica e profissional.', color: 'green' },
    { id: 'formacao_complementar', name: 'Atividades de Formação Complementar', description: 'Atividades que complementam a formação acadêmica e profissional.', color: 'yellow' },
    { id: 'producao_cientifica', name: 'Atividades de Produção Científica', description: 'Atividades relacionadas à pesquisa, ensino e extensão.', color: 'purple' },
    { id: 'eventos', name: 'Atividades de Eventos', description: 'Atividades relacionadas a eventos acadêmicos, culturais e esportivos.', color: 'orange' },
    { id: 'ensino', name: 'Atividades de Ensino', description: 'Atividades direcionadas ao ensino, incluindo aulas, tutoriais e minicursos.', color: 'gray' },
  ];
  
  // Function to generate appropriate color classes based on category
  type CategoryColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange' | 'gray';
  type ColorType = 'bg' | 'border' | 'button';
  const getCategoryColorClasses = (categoryId: string, type: ColorType) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    const colorMap: Record<CategoryColor, { bg: string; border: string; button: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', button: 'bg-blue-600 hover:bg-blue-700' },
      red: { bg: 'bg-red-50', border: 'border-red-200', button: 'bg-red-600 hover:bg-red-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', button: 'bg-green-600 hover:bg-green-700' },
      yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', button: 'bg-yellow-600 hover:bg-yellow-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', button: 'bg-purple-600 hover:bg-purple-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', button: 'bg-orange-600 hover:bg-orange-700' },
      gray: { bg: 'bg-gray-50', border: 'border-gray-200', button: 'bg-gray-600 hover:bg-gray-700' },
    };
    return colorMap[category.color as CategoryColor][type];
  };
  
  const comoFunciona1 = [
    { titulo: 'Pontuação por Atividade', texto: 'Cada atividade realizada contribui para a pontuação total do usuário.' },
    { titulo: 'Níveis de Pontuação', texto: 'Existem diferentes níveis de pontuação, cada um com requisitos específicos.' },
    { titulo: 'Requisitos Mínimos', texto: 'Para alcançar um nível superior, é necessário cumprir os requisitos mínimos do nível atual.' },
  ];
  const comoFunciona2 = [
    { titulo: 'Atividades de Experiência', texto: 'Atividades que visam a formação de competências práticas e habilidades técnicas.' },
    { titulo: 'Atividades de Formação', texto: 'Atividades voltadas à formação acadêmica e profissional.' },
    { titulo: 'Atividades de Formação Complementar', texto: 'Atividades que complementam a formação acadêmica e profissional.' },
    { titulo: 'Atividades de Produção Científica', texto: 'Atividades relacionadas à pesquisa, ensino e extensão.' },
    { titulo: 'Atividades de Eventos', texto: 'Atividades relacionadas a eventos acadêmicos, culturais e esportivos.' },
    { titulo: 'Atividades de Ensino', texto: 'Atividades direcionadas ao ensino, incluindo aulas, tutoriais e minicursos.' },
  ];
  const requisitos = [
    { nivel: 'Nível 1', itens: ['Atividade básica', 'Pequena contribuição para o ambiente acadêmico.'] },
    { nivel: 'Nível 2', itens: ['Atividade intermediária', 'Contribuição significativa para a formação acadêmica.'] },
    { nivel: 'Nível 3', itens: ['Atividade avançada', 'Grande impacto na formação acadêmica e profissional.'] },
  ];
  
  return (
    <div className="container mx-auto px-4 pt-24">
      {/* Header com título e animação lado a lado */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Cadastro de Atividade</h1>
          <p className="text-gray-600 max-w-2xl">
            Preencha os dados da atividade realizada para pontuação.
          </p>
        </div>
        <div className="w-32 h-32 mt-4 lg:mt-0 flex-shrink-0">
          {renderLottieView()}
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
            {comoFunciona1.map((item, idx) => (
              <div className="flex items-start" key={item.titulo}>
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-indigo-600 text-sm font-semibold">{idx+1}</span>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800">{item.titulo}</h3>
                  <p className="text-sm text-indigo-700">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {comoFunciona2.map((item, idx) => (
              <div className="flex items-start" key={item.titulo}>
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-indigo-600 text-sm font-semibold">{idx+4}</span>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800">{item.titulo}</h3>
                  <p className="text-sm text-indigo-700">{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 p-3 bg-indigo-100 rounded-md">
          <p className="text-sm text-indigo-800">
            <strong>Exemplo:</strong> Cada atividade realizada contribui para a pontuação total do usuário.
          </p>
        </div>
      </div>

      {/* Seção informativa sobre requisitos mínimos por nível */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Requisitos mínimos por nível
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requisitos.map((nivel, idx) => (
            <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow" key={nivel.nivel}>
              <h3 className="font-semibold text-green-800 mb-3 flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {nivel.nivel}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Nível {idx + 1}
                </span>
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                {nivel.itens.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-green-100 rounded-md">
          <p className="text-sm text-green-800">
            <strong>💡 Importante:</strong> Para alcançar um nível superior, é necessário cumprir os requisitos mínimos do nível atual.
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
                  {categories.find(cat => cat.id === categoryFilter)?.description}
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
                {category.description}
              </p>
            </button>
          ))}
        </div>
      )}
      
      {/* Activity registration form */}
      <ActivityRegistration />
    </div>
  );
};

export default ActivityRegistrationPage; 