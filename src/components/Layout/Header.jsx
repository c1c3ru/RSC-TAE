import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Function to get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    // Map specific paths to titles
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/activity/register':
        return 'Registrar Atividade';
      case '/activity/history':
        return 'Histórico de Atividades';
      case '/reports':
        return 'Relatórios';
      case '/profile':
        return 'Meu Perfil';
      default:
        return 'Sistema de Cálculo de Pontuação';
    }
  };
  
  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && event.target && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled 
          ? 'bg-white text-blue-800 shadow-lg py-2' 
          : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          {/* Hamburger Menu Button */}
          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mr-3 p-1.5 rounded-md focus:outline-none"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 transition-all ${scrolled ? 'text-blue-600' : 'text-white'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          <div className="font-bold text-xl md:text-2xl transition-all duration-300">
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity" aria-label="Go to Dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" 
                className={`h-7 w-7 mr-2 transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden md:inline"
              >
                Sistema de Pontuação
              </motion.span>
            </Link>
          </div>
          
          {/* Current Page Title with animation */}
          <motion.div 
            className="ml-4 text-sm md:text-base font-medium border-l pl-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={location.pathname} // Re-animate when path changes
            transition={{ type: "spring", stiffness: 100 }}
          >
            {getPageTitle()}
          </motion.div>
        </div>
        
        {currentUser && (
          <div className="flex items-center space-x-4">
            <motion.div 
              className="text-sm hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-medium">{currentUser.nome}</div>
              <div className="text-xs opacity-80">{currentUser.cargo}</div>
            </motion.div>
            
            <div className="relative user-dropdown">
              <motion.button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className={`rounded-full p-2 focus:outline-none focus:ring-2 transition-all ${
                  scrolled 
                    ? 'bg-blue-100 focus:ring-blue-400 hover:bg-blue-200' 
                    : 'bg-blue-800 focus:ring-blue-300 hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-haspopup="true"
                aria-expanded={showDropdown}
                aria-label="User menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </motion.button>
              
              {/* Dropdown menu with animation */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: "spring", bounce: 0.25 }}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.nome}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    
                    <NavLink 
                      to="/dashboard" 
                      onClick={() => setShowDropdown(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors 
                        ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`
                      }
                      role="menuitem"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Dashboard
                      </span>
                    </NavLink>
                    
                    <NavLink 
                      to="/profile" 
                      onClick={() => setShowDropdown(false)}
                      className={({ isActive }) => 
                        `block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors 
                        ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`
                      }
                      role="menuitem"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        Meu Perfil
                      </span>
                    </NavLink>
                    
                    <div className="border-t border-gray-100 mt-1"></div>
                    
                    <motion.button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      whileHover={{ backgroundColor: "rgba(254, 226, 226, 0.7)" }}
                      role="menuitem"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 8H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Sair
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;