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
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        </div>

        <nav className="p-4">
          {/* Navigation Items */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Categories Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Categorias
            </h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const score = categoryScores[category.id] || 0;
                const isSelected = selectedCategory === category.id;

                return (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                      isSelected ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className={`w-4 h-4 rounded-full ${category.color} mr-3 transition-all duration-300 ${
                            isSelected ? 'scale-125 shadow-lg' : ''
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {score.toFixed(1)}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-2 ml-7 animate-fadeIn">
                        <div className="text-xs text-gray-600">
                          Pontuação: <span className="font-semibold">{score.toFixed(2)} pontos</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;