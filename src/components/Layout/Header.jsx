import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../context/LayoutContext'; // Import useLayout
import { LABELS } from '../../constants/texts';

const Header = () => {
  const { currentUser, logout } = useAuth(); // Changed signOut to logout
  const { isSidebarCollapsed, toggleSidebar } = useLayout(); // Use LayoutContext

  const handleSignOut = async () => {
    try {
      await logout(); // Changed signOut() to logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50"> {/* Added fixed positioning and z-index */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 text-gray-600" // Removed lg:hidden
            title={isSidebarCollapsed ? "Expandir menu" : "Encolher menu"}
          >
            {isSidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
              </svg>
            )}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {LABELS.sistemaTitulo}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Bem-vindo(a), <span className="font-medium">{currentUser?.user_metadata?.nome || currentUser?.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {LABELS.sair}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;