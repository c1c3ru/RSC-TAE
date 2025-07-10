
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const setSidebarCollapsed = (collapsed: boolean): void => {
    setIsSidebarCollapsed(collapsed);
  };

  const value: LayoutContextType = {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};
