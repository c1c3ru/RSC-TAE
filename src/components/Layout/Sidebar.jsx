import React, { useState, useEffect } from 'react'; // Import useState for selectedCategory
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompetency } from '../../context/CompetencyContext';
import { useLayout } from '../../context/LayoutContext'; // Import useLayout
import { LABELS } from '../../constants/texts';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryScores } = useCompetency();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isSidebarCollapsed, toggleSidebar } = useLayout(); // Use LayoutContext

  // Remover o useEffect que força o menu expandido em telas menores

  // Usar nomes de categoria exatamente como no banco
  const categories = [
    { id: 'Administrativas', name: 'Atividades Administrativas', color: 'bg-blue-500' },
    { id: 'Experiência', name: 'Experiência Profissional', color: 'bg-green-500' },
    { id: 'Formação', name: 'Formação Acadêmica', color: 'bg-purple-500' },
    { id: 'Formação Complementar', name: 'Formação Complementar', color: 'bg-yellow-500' },
    { id: 'Produção Científica', name: 'Produção Científica', color: 'bg-red-500' },
    { id: 'Eventos', name: 'Participação em Eventos', color: 'bg-pink-500' },
    { id: 'Ensino', name: 'Atividades de Ensino', color: 'bg-indigo-500' },

  ];

  const menuItems = [
    { path: '/dashboard', label: LABELS.dashboard, icon: '📊' },
    { path: '/register', label: LABELS.registrarAtividade, icon: '➕' },
    { path: '/profile', label: 'Meu Perfil', icon: '👤' }
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
      {/* Main sidebar div with conditional width and flex layout */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-gray-800">{LABELS.menu}</h2>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Navigation Items */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                title={isSidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className={`text-lg ${!isSidebarCollapsed ? 'mr-3' : ''}`}>{item.icon}</span>
                {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </div>

          {/* Categories Section */}
          {!isSidebarCollapsed && ( // Hide entire categories section header if collapsed for now
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                {!isSidebarCollapsed && 'Categorias'}
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => {
                  const score = categoryScores[index] || 0;
                  const isSelected = selectedCategory === category.id;

                  return (
                    <div
                      key={category.id}
                      title={isSidebarCollapsed ? `${category.name} - ${score.toFixed(1)} pts` : ''}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        isSelected ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'
                      } ${isSidebarCollapsed ? 'flex justify-center items-center' : ''}`}
                      onClick={() => !isSidebarCollapsed && handleCategoryClick(category.id)} // Prevent click handling when collapsed for simplicity
                    >
                      <div className={`flex items-center ${isSidebarCollapsed ? '' : 'justify-between w-full'}`}>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full ${category.color} ${!isSidebarCollapsed ? 'mr-3' : ''} transition-all duration-300 ${
                              isSelected && !isSidebarCollapsed ? 'scale-125 shadow-lg' : '' // Only scale if not collapsed
                            }`}
                          />
                          {!isSidebarCollapsed && (
                            <span className="text-sm font-medium text-gray-700">
                              {category.name}
                            </span>
                          )}
                        </div>
                        {!isSidebarCollapsed && (
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {score.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {isSelected && !isSidebarCollapsed && (
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
          )}
        </nav>

        {/* Sidebar Footer for Collapse Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleSidebar} // Use toggleSidebar from context
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-200"
            title={isSidebarCollapsed ? "Expandir" : "Encolher"}
          >
            {isSidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            )}
            {!isSidebarCollapsed && <span className="ml-2 text-sm">Encolher</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;