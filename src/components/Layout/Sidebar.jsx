import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompetency } from '../../context/CompetencyContext';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryScores } = useCompetency();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: 'Atividades Administrativas', color: 'bg-blue-500' },
    { id: 2, name: 'Experiência Profissional', color: 'bg-green-500' },
    { id: 3, name: 'Formação Acadêmica', color: 'bg-purple-500' },
    { id: 4, name: 'Formação Complementar', color: 'bg-yellow-500' },
    { id: 5, name: 'Produção Científica', color: 'bg-red-500' },
    { id: 6, name: 'Outras Atividades', color: 'bg-indigo-500' }
  ];

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/register', label: 'Registrar Atividade', icon: '➕' },
    { path: '/history', label: 'Histórico', icon: '📋' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-full
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Sistema RSC</h2>
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Menu Principal
          </h3>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive(item.path) 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Categories */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Categorias
          </h3>
          <div className="space-y-2">
            {categories.map((category, index) => {
              const score = categoryScores[index] || 0;
              const isSelected = selectedCategory === category.id;

              return (
                <div key={category.id} className="relative">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`
                      w-full flex items-center justify-between p-3 text-sm rounded-lg 
                      transition-all duration-200 ease-in-out
                      ${isSelected 
                        ? 'bg-gray-100 shadow-md transform scale-105' 
                        : 'hover:bg-gray-50 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-3 h-3 rounded-full mr-3 transition-transform duration-200
                        ${category.color}
                        ${isSelected ? 'animate-pulse scale-125' : ''}
                      `} />
                      <span className={`
                        font-medium truncate
                        ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                      `}>
                        {category.name}
                      </span>
                    </div>
                    <div className={`
                      text-xs font-semibold px-2 py-1 rounded-full
                      ${isSelected 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {score.toFixed(1)}
                    </div>
                  </button>

                  {/* Category Details */}
                  {isSelected && (
                    <div className="mt-2 ml-6 p-3 bg-gray-50 rounded-lg border-l-2 border-blue-400 animate-fadeIn">
                      <div className="text-xs text-gray-600">
                        <div className="mb-1">
                          <span className="font-medium">Pontuação:</span> {score.toFixed(1)} pontos
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-1 ${score > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                            {score > 0 ? 'Ativo' : 'Sem atividades'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Sistema de Reconhecimento de Saberes
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;