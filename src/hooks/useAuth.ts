
import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext';
import type { AuthContextType } from '@/types/global';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default useAuth;
