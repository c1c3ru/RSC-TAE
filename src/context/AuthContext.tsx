
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User, Session, AuthError } from '@supabase/supabase-js';

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        // Tratar erros específicos
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos. Verifique suas credenciais.');
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationEmail = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, profileData?: any): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      
      // Criar perfil do usuário na tabela user_profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: profileData?.nome || profileData?.name || null,
              employee_number: profileData?.matricula || null,
              job: profileData?.cargo || null,
              functional_category: profileData?.functionalCategory || null,
              date_singin: new Date().toISOString(),
              education: profileData?.escolaridade || null
            }
          ]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Tentar criar um perfil básico se falhar
          const { error: basicProfileError } = await supabase
            .from('user_profile')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name: null,
                employee_number: null,
                job: null,
                functional_category: null,
                date_singin: new Date().toISOString(),
                education: null
              }
            ]);
          
          if (basicProfileError) {
            console.error('Error creating basic user profile:', basicProfileError);
            // Não vamos falhar o cadastro se o perfil não for criado
            // O usuário pode criar o perfil depois
          }
        }
      }
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
