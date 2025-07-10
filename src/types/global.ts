
// Tipos globais para a aplicação
export interface User {
  id: string;
  email: string;
  nome?: string;
  cargo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: string;
  user_id: string;
  titulo: string;
  categoria: string;
  pontuacao: number;
  data_atividade: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CompetencyItem {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface CompetencyContextType {
  activities: Activity[];
  competencyItems: CompetencyItem[];
  loading: boolean;
  addActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

export interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Tipos para APIs
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Tipos para componentes
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}
