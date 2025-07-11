import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Busca a sessão inicial ao carregar o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listener para mudanças no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const user = session?.user;
      setCurrentUser(user ?? null);
      
      // Se o usuário acabou de fazer login, garanta que o perfil exista
      if (event === 'SIGNED_IN' && user) {
        ensureUserProfileExists(user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função centralizada para garantir a criação do perfil
  const ensureUserProfileExists = async (user: User): Promise<void> => {
    try {
      // 1. Verifica se o perfil já existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profile')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar perfil:', checkError);
        return;
      }

      // 2. Se não existe, cria um novo
      if (!existingProfile) {
        console.log('Perfil não encontrado para o usuário, criando um novo...');
        const { error: createError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: user.id,
              email: user.email, // Usa o e-mail real do usuário
              name: user.user_metadata?.name || user.email, // Usa o nome dos metadados ou o e-mail
              // Outros campos podem ser nulos ou ter valores padrão
            }
          ]);
        
        if (createError) {
          // Se o erro for de duplicidade (outro usuário com mesmo email), não é um erro fatal aqui.
          if (createError.code === '23505') {
             console.warn('Conflito de e-mail ao criar perfil. Outro usuário pode ter o mesmo e-mail.', createError.message);
          } else {
             console.error('Erro CRÍTICO ao criar perfil básico:', createError);
          }
        } else {
          console.log('Perfil básico criado com sucesso para o usuário:', user.id);
        }
      }
    } catch (error) {
      console.error('Erro inesperado na função ensureUserProfileExists:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    // O listener onAuthStateChange cuidará do resto
  };

  const loginWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Redirecionamento seguro
      },
    });
    if (error) throw error;
  };

  const resendConfirmationEmail = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  };

  const register = async (email: string, password: string, profileData?: any): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData // Passa os dados do perfil para os metadados
      }
    });
    if (error) throw error;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    // O listener onAuthStateChange cuidará de limpar o estado
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

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth };
