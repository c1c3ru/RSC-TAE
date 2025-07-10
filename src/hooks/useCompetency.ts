
import { useContext } from 'react';
import { CompetencyContext } from '@context/CompetencyContext';
import type { CompetencyContextType } from '@/types/global';

export const useCompetency = (): CompetencyContextType => {
  const context = useContext(CompetencyContext);
  
  if (!context) {
    throw new Error('useCompetency deve ser usado dentro de um CompetencyProvider');
  }
  
  return context;
};

export default useCompetency;
