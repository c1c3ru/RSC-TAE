
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { competencyItems as defaultCompetencyItems } from '../data/competencyItems';

export interface ValidationRules {
  docs?: string[];
  [key: string]: any;
}

// Ajustar interface Competency para refletir o banco
export interface Competency {
  id: string;
  category: string;
  title: string;
  type: string;
  points_per_unit: number;
  max_points: number;
  unit: string;
  validation_rules?: ValidationRules;
}

interface CompetencyContextType {
  competencyItems: Competency[];
  loading: boolean;
  error: string | null;
  getCompetencyById: (id: string) => Competency | undefined;
  getCompetenciesByCategory: (category: string) => Competency[];
  getAllCategories: () => string[];
}

const CompetencyContext = createContext<CompetencyContextType | undefined>(undefined);

export const useCompetency = (): CompetencyContextType => {
  const context = useContext(CompetencyContext);
  if (context === undefined) {
    throw new Error('useCompetency must be used within a CompetencyProvider');
  }
  return context;
};

interface CompetencyProviderProps {
  children: ReactNode;
}

export const CompetencyProvider: React.FC<CompetencyProviderProps> = ({ children }) => {
  const [competencyItems, setCompetencyItems] = useState<Competency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompetencyItems();
  }, []);

  const loadCompetencyItems = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use default items. In the future, this could load from Supabase
      setCompetencyItems(defaultCompetencyItems);
    } catch (err) {
      console.error('Error loading competency items:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getCompetencyById = (id: string): Competency | undefined => {
    return competencyItems.find(item => item.id === id);
  };

  const getCompetenciesByCategory = (category: string): Competency[] => {
    return competencyItems.filter(item => item.category === category);
  };

  const getAllCategories = (): string[] => {
    const categories = new Set(competencyItems.map(item => item.category));
    return Array.from(categories).sort();
  };

  const value: CompetencyContextType = {
    competencyItems,
    loading,
    error,
    getCompetencyById,
    getCompetenciesByCategory,
    getAllCategories,
  };

  return (
    <CompetencyContext.Provider value={value}>
      {children}
    </CompetencyContext.Provider>
  );
};
