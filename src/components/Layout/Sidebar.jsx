import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  
  // Navigation items with icons
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      animation: "/assets/animations/loading-animation.json"
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

  // Hover state for menu items
  const [hoveredItem, setHoveredItem] = useState(null);

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

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      width: "16rem", // 64 in tailwind
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: "4rem", // 16 in tailwind
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.15
      }
    }
  };

  // Content fade-in animation variants
  const fadeInVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 }
  };

  return (
    <motion.aside 
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="fixed inset-y-0 left-0 z-20 bg-white shadow-lg pt-16 border-r overflow-hidden"
      aria-label="Sidebar for navigation"
    >
      <div className="overflow-y-auto h-full custom-scrollbar">
        <nav className="px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.li 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive: pathIsActive }) => 
                      `flex items-center px-3 py-2 rounded-lg transition-all duration-300 relative ${
                        !isOpen ? 'justify-center' : ''
                      } ${
                        pathIsActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className={`${isOpen ? 'mr-3' : ''} relative`}>
                      {item.icon}
                      {isActive && (
                        <motion.div
                          className="absolute -right-1.5 -top-1.5 h-2 w-2 bg-blue-500 rounded-full"
                          layoutId="activeIndicator"
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span 
                          className="whitespace-nowrap"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={fadeInVariants}
                          transition={{ duration: 0.2 }}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {isActive && item.animation && (
                      <div className="absolute right-2 opacity-25">
                        <Player
                          autoplay
                          loop
                          src={item.animation}
                          style={{ height: '30px', width: '30px' }}
                        />
                      </div>
                    )}
                  </NavLink>
                </motion.li>
              );
            })}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="px-2 py-2 absolute bottom-8 w-full">
          <motion.button
            onClick={logout}
            whileHover={{ backgroundColor: "rgba(254, 226, 226, 0.7)" }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
              !isOpen ? 'justify-center' : ''
            } text-gray-700 hover:bg-red-50 hover:text-red-700`}
            aria-label="Sair da conta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 8H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                  className="whitespace-nowrap"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeInVariants}
                >
                  Sair
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        
        {/* Categories section - only show when expanded */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="px-2 py-2 mt-4 border-t border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1 }}
            >
              <h5 className="text-xs uppercase font-semibold text-gray-500 tracking-wide mb-2 px-3">
                Categorias
              </h5>
              <ul className="space-y-1">
                {categories.map((category, index) => {
                  const isActiveCategory = location.pathname === '/activity/register' && 
                                         new URLSearchParams(location.search).get('category') === category.id.toString();
                  return (
                    <motion.li 
                      key={category.id} 
                      className="transform transition hover:translate-x-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ x: 4 }}
                    >
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
                        <motion.span 
                          className={`w-2 h-2 rounded-full mr-2 ${getCategoryColorClasses(category.baseColor, 'dot')}`}
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                        {category.name}
                      </NavLink>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add custom scrollbar and animation styles */}
      <style jsx="true">{`
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
    </motion.aside>
  );
};

export default Sidebar;
