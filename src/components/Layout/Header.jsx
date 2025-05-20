import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Function to get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/activity/register') return 'Registrar Atividade';
    if (path === '/activity/history') return 'Histórico de Atividades';
    if (path === '/reports') return 'Relatórios';
    if (path === '/profile') return 'Meu Perfil';
    return 'Sistema de Cálculo de Pontuação';
  };
  
  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? 'bg-white text-blue-800 shadow-lg py-2' : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3'}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="font-bold text-xl md:text-2xl transition-all duration-300">
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" 
                className={`h-7 w-7 mr-2 transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`} 
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span className="hidden md:inline">Sistema de Pontuação</span>
            </Link>
          </div>
          
          {/* Current Page Title with animation */}
          <div className="ml-4 text-sm md:text-base font-medium border-l pl-4 animate-fadeIn">
            {getPageTitle()}
          </div>
        </div>
        
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="text-sm hidden md:block">
              <div className="font-medium">{currentUser.nome}</div>
              <div className="text-xs opacity-80">{currentUser.cargo}</div>
            </div>
            
            <div className="relative user-dropdown">
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className={`rounded-full p-2 focus:outline-none focus:ring-2 transition-all transform hover:scale-105 ${scrolled ? 'bg-blue-100 focus:ring-blue-400' : 'bg-blue-800 focus:ring-blue-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown menu with animation */}
              <div 
                className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 transform transition-all duration-200 origin-top-right ${showDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.nome}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
                
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Dashboard
                  </span>
                </Link>
                
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    Meu Perfil
                  </span>
                </Link>
                
                <div className="border-t border-gray-100 mt-1"></div>
                
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 8H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sair
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;