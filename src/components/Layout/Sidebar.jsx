// src/components/Layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Changed Link to NavLink
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  // Navigation items
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    { 
      title: 'Registrar Atividade', 
      path: '/activity/register', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) 
    },
    { 
      title: 'Histórico de Atividades', 
      path: '/activity/history', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ) 
    },
    { 
      title: 'Relatórios', 
      path: '/reports', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-2a1 1 0 10-2 0v5a1 1 0 102 0V9zm4-1a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ) 
    }
  ];

  // Categories with their colors for dynamic styling
  const categories = [
    { id: 1, name: 'Atividades Administrativas', baseColor: 'blue' },
    { id: 2, name: 'Experiência Profissional', baseColor: 'red' },
    { id: 3, name: 'Formação e Capacitação', baseColor: 'green' },
    { id: 4, name: 'Produção Científica', baseColor: 'yellow' },
    { id: 5, name: 'Participação em Eventos', baseColor: 'purple' },
    { id: 6, name: 'Atividades de Ensino', baseColor: 'orange' }
  ];

  // Function to get Tailwind color classes dynamically
  const getCategoryColorClasses = (baseColor, type) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        hoverBg: 'hover:bg-blue-100',
        hoverText: 'hover:text-blue-800',
        dot: 'bg-blue-500'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        hoverBg: 'hover:bg-red-100',
        hoverText: 'hover:text-red-800',
        dot: 'bg-red-500'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        hoverBg: 'hover:bg-green-100',
        hoverText: 'hover:text-green-800',
        dot: 'bg-green-500'
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        hoverBg: 'hover:bg-yellow-100',
        hoverText: 'hover:text-yellow-800',
        dot: 'bg-yellow-500'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        hoverBg: 'hover:bg-purple-100',
        hoverText: 'hover:text-purple-800',
        dot: 'bg-purple-500'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        hoverBg: 'hover:bg-orange-100',
        hoverText: 'hover:text-orange-800',
        dot: 'bg-orange-500'
      }
    };
    return colorMap[baseColor]?.[type] || '';
  };

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-10 bg-white shadow-lg pt-16 border-r transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
      aria-label="Sidebar for navigation"
    >
      {/* Toggle button */}
      <button 
        onClick={toggleSidebar} 
        className={`absolute top-20 -right-3 bg-white border border-gray-200 rounded-full p-1 shadow-md z-20 transition-transform hover:scale-110 ${collapsed ? 'rotate-180' : ''}`}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={collapsed}
        aria-controls="sidebar-menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <div id="sidebar-menu" className="overflow-y-auto h-full custom-scrollbar">
        <nav className="px-2 py-2">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-lg transition-all duration-300 
                    ${collapsed ? 'justify-center' : ''} 
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                    }`
                  }
                >
                  <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                  {!collapsed && (
                    <span className="whitespace-nowrap transition-opacity duration-200">{item.title}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="px-2 py-2">
          <button
            onClick={logout}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${collapsed ? 'justify-center' : ''} text-gray-700 hover:bg-red-50 hover:text-red-700 hover:scale-[1.02]`}
            aria-label="Sair da conta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 8H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            {!collapsed && <span className="whitespace-nowrap transition-opacity duration-200">Sair</span>}
          </button>
        </div>
        
        {/* Categories section - only show when expanded */}
        {!collapsed && (
          <div className="px-2 py-2 mt-4 border-t border-gray-100">
            <h5 className="text-xs uppercase font-semibold text-gray-500 tracking-wide mb-2 px-3">
              Categorias
            </h5>
            <ul className="space-y-1">
              {categories.map((category) => {
                const isActiveCategory = location.pathname === '/activity/register' && 
                                         new URLSearchParams(location.search).get('category') === category.id.toString();
                return (
                  <li key={category.id} className="transform transition hover:translate-x-1">
                    <NavLink
                      to={`/activity/register?category=${category.id}`}
                      className={({ isActive }) => 
                        `flex items-center px-3 py-1.5 text-sm rounded-md 
                        ${isActiveCategory 
                          ? getCategoryColorClasses(category.baseColor, 'bg') + ' ' + getCategoryColorClasses(category.baseColor, 'text')
                          : 'text-gray-700 ' + getCategoryColorClasses(category.baseColor, 'hoverBg') + ' ' + getCategoryColorClasses(category.baseColor, 'hoverText')
                        }`
                      }
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${getCategoryColorClasses(category.baseColor, 'dot')}`}></span>
                      {category.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Add custom scrollbar style */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 10px;
          transition: all 0.3s;
          background-color: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;