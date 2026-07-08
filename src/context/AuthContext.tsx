import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, profileData?: any) => Promise<void>;
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
    user_metadata: { name: 'Usuário Temporário' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'user@example.com',
  } as User;

  const [currentUser] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>({ user: mockUser } as Session);
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

