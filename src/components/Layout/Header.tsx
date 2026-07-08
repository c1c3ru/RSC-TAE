import * as React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../context/LayoutContext';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const { toggleSidebar } = useLayout();

  return (
    <header className="bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-40 min-w-0">
      <div className="flex items-center justify-between px-4 py-3 min-w-0">
        <div className="flex items-center min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-lg sm:text-xl font-semibold text-gray-900 break-words min-w-0">Sistema RSC</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <span className="hidden sm:block text-sm text-gray-600 break-words min-w-0">
            {currentUser?.email}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
