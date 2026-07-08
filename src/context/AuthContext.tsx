import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface User {
  id: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
  email?: string;
}

export interface Session {
  user: User | null;
}
interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, profileData?: Record<string, unknown>) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
  // Always logged in mock user
  const mockUser: User = {
    id: 'mock-user-123',
    app_metadata: {},
    // cspell:disable-next-line
    user_metadata: { name: 'Visitante (TAE)' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'visitante@rsc.local',
  };

  const [currentUser] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>({ user: mockUser });
  const [loading] = useState<boolean>(false);

  const login = async (): Promise<void> => {};
  const loginWithGoogle = async (): Promise<void> => {};
  const logout = async (): Promise<void> => {};
  const register = async (): Promise<void> => {};
  const resendConfirmationEmail = async (): Promise<void> => {};

  const value: AuthContextType = {
    currentUser,
    session,
    loading,
    login,
    loginWithGoogle,
    logout,
    register,
    resendConfirmationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

