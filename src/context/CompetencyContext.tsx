
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { competencyItems as defaultCompetencyItems } from '../data/competencyItems';

export interface CompetencyItem {
  id: string;
  category: string;
  description: string;
  value: number;
  maxQuantity?: number;
  unit?: string;
}

interface CompetencyContextType {
  competencyItems: CompetencyItem[];
  loading: boolean;
  error: string | null;
  getCompetencyById: (id: string) => CompetencyItem | undefined;
  getCompetenciesByCategory: (category: string) => CompetencyItem[];
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
  const [competencyItems, setCompetencyItems] = useState<CompetencyItem[]>([]);
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

  const getCompetencyById = (id: string): CompetencyItem | undefined => {
    return competencyItems.find(item => item.id === id);
  };

  const getCompetenciesByCategory = (category: string): CompetencyItem[] => {
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
