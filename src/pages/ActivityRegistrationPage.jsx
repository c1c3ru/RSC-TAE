import React from 'react';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration';
import { useAuth } from '../context/AuthContext';
import { useCompetency } from '../context/CompetencyContext';

const ActivityRegistrationPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { activeCategoryFilter, filterItemsByCategory } = useCompetency();

  const categories = [
    { id: 1, name: 'Atividades Administrativas', desc: 'Fiscalização, comissões e gestão', color: 'blue' },
    { id: 2, name: 'Experiência Profissional', desc: 'Tempo de serviço e funções', color: 'red' },
    { id: 3, name: 'Formação e Capacitação', desc: 'Cursos e titulação acadêmica', color: 'green' },
    { id: 4, name: 'Produção Científica', desc: 'Publicações e patentes', color: 'yellow' },
    { id: 5, name: 'Participação em Eventos', desc: 'Eventos e projetos', color: 'purple' },
    { id: 6, name: 'Atividades de Ensino', desc: 'Orientações e ensino', color: 'orange' },
  ];

  const getCategoryColorClasses = (color, isActive) => {
    // ... (sua função de cores permanece a mesma)
    const colorStyles = {
      blue: { inactive: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100', active: 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105' },
      red: { inactive: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100', active: 'bg-red-600 border-red-700 text-white shadow-lg scale-105' },
      green: { inactive: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100', active: 'bg-green-600 border-green-700 text-white shadow-lg scale-105' },
      yellow: { inactive: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100', active: 'bg-yellow-500 border-yellow-600 text-white shadow-lg scale-105' },
      purple: { inactive: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100', active: 'bg-purple-600 border-purple-700 text-white shadow-lg scale-105' },
      orange: { inactive: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100', active: 'bg-orange-500 border-orange-600 text-white shadow-lg scale-105' },
    };
    return isActive ? colorStyles[color].active : colorStyles[color].inactive;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar Nova Atividade</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map(category => {
          const isActive = activeCategoryFilter === category.id;
          return (
            <button key={category.id} onClick={() => filterItemsByCategory(category.id)} className={`p-4 rounded-lg border text-left transition-all duration-300 ease-in-out transform ${getCategoryColorClasses(category.color, isActive)}`}>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className={`text-sm mt-1 ${isActive ? 'text-white opacity-80' : 'text-gray-600'}`}>
                {category.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* --- INÍCIO DA MUDANÇA PRINCIPAL --- */}

      {/* Wrapper para o Efeito de "Acordeão/Expandir" */}
      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden ${
          activeCategoryFilter ? 'max-h-[2000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
      >
        {/* Renderiza o conteúdo do formulário aqui dentro */}
        {/* Ele sempre estará no DOM, mas só será visível quando a categoria estiver ativa */}
        {!authLoading && currentUser ? (
          <ActivityRegistration categoryFilter={activeCategoryFilter} />
        ) : (
          <p className="text-center text-gray-500 py-8">
            {authLoading ? 'Carregando...' : 'Faça login para registrar atividades.'}
          </p>
        )}
      </div>

      {/* --- FIM DA MUDANÇA PRINCIPAL --- */}

    </div>
  );
};

export default ActivityRegistrationPage;