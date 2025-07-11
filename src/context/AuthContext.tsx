
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfileExists = async (userId: string): Promise<void> => {
    try {
      console.log('🔍 Debug - Verificando se usuário tem perfil:', userId);
      
      // Verificar se o perfil existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profile')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('🔍 Debug - Erro ao verificar perfil:', checkError);
        return; // Não tentar criar se não conseguir verificar
      }
      
      if (!existingProfile) {
        console.log('🔍 Debug - Usuário não tem perfil, criando perfil básico...');
        
        // Criar perfil básico para o usuário
        const { error: createError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: userId,
              email: currentUser?.email || null,
              name: null,
              employee_number: null,
              job: null,
              functional_category: null,
              date_singin: new Date().toISOString(),
              education: null
            }
          ]);
        
        if (createError) {
          // Se for erro 409 (Conflict), o perfil já existe, então está tudo certo
          if (createError.code === '409') {
            console.log('🔍 Debug - Perfil já existia, prosseguindo normalmente.');
            return;
          }
          console.error('🔍 Debug - Erro ao criar perfil básico:', createError);
          
          // Se falhar, tentar com upsert
          const { error: upsertError } = await supabase
            .from('user_profile')
            .upsert([
              {
                id: userId,
                email: currentUser?.email || null,
                name: null,
                employee_number: null,
                job: null,
                functional_category: null,
                date_singin: new Date().toISOString(),
                education: null
              }
            ], {
              onConflict: 'id'
            });
          
          if (upsertError) {
            console.error('🔍 Debug - Erro ao criar perfil com upsert:', upsertError);
            console.log('🔍 Debug - Perfil não foi criado. Usuário pode continuar usando o sistema.');
          } else {
            console.log('🔍 Debug - Perfil criado com upsert');
          }
        } else {
          console.log('🔍 Debug - Perfil básico criado com sucesso');
        }
      } else {
        console.log('🔍 Debug - Usuário já tem perfil');
      }
    } catch (error) {
      console.error('🔍 Debug - Erro ao verificar/criar perfil:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('🔍 Debug - Tentando login com email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔍 Debug - Resposta do Supabase:', { data, error });
      
      if (error) {
        console.error('🔍 Debug - Erro detalhado:', error);
        
        // Tratar erros específicos com mensagens mais claras
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.');
        } else if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid email or password')) {
          throw new Error('Email ou senha incorretos. Verifique suas credenciais.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.');
        } else if (error.message.includes('User not found')) {
          throw new Error('Usuário não encontrado. Verifique se o email está correto.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Senha muito curta. A senha deve ter pelo menos 6 caracteres.');
        } else if (error.message.includes('Unable to validate email address')) {
          throw new Error('Email inválido. Verifique se o formato está correto.');
        } else if (error.message.includes('Signup not allowed')) {
          throw new Error('Cadastro não permitido. Entre em contato com o administrador.');
        } else if (error.message.includes('User is disabled')) {
          throw new Error('Usuário desabilitado. Entre em contato com o administrador.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Formato de email inválido. Verifique se o email está correto.');
        } else {
          // Para outros erros, usar a mensagem original mas com contexto
          throw new Error(`Erro no login: ${error.message}`);
        }
      }
      
      // Se o login foi bem-sucedido, verificar se o usuário tem perfil
      if (data.user) {
        console.log('🔍 Debug - Login bem-sucedido, verificando perfil...');
        await ensureUserProfileExists(data.user.id);
      }
      
      console.log('🔍 Debug - Login concluído com sucesso');
      
    } catch (error) {
      console.error('🔍 Debug - Erro no login:', error);
      
      // Se já é um Error com mensagem personalizada, apenas relançar
      if (error instanceof Error) {
      throw error;
      }
      
      // Para outros tipos de erro, criar uma mensagem genérica
      throw new Error('Erro inesperado durante o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log('🔍 Debug - Iniciando login com Google');
      console.log('🔍 Debug - URL atual:', window.location.href);
      console.log('🔍 Debug - Origin:', window.location.origin);
      
      // Determinar URL de redirecionamento baseada no ambiente
      let redirectUrl = window.location.origin;
      
      // Se estiver no Vercel, usar a URL específica
      if (window.location.hostname.includes('vercel.app')) {
        redirectUrl = 'https://rsc-tae.vercel.app/dashboard';
        console.log('🔍 Debug - Ambiente Vercel detectado');
      } else if (window.location.hostname === 'localhost') {
        redirectUrl = 'http://localhost:5000/dashboard';
        console.log('🔍 Debug - Ambiente local detectado');
      }
      
      console.log('🔍 Debug - URL de redirecionamento:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      console.log('🔍 Debug - Resposta do Supabase:', { data, error });
      
      if (error) {
        console.error('🔍 Debug - Erro do Supabase:', error);
        throw error;
      }
      
      console.log('🔍 Debug - Login Google iniciado com sucesso');
      
    } catch (error) {
      console.error('🔍 Debug - Erro no login com Google:', error);
      
      // Tratar erros específicos
      if (error instanceof Error) {
        if (error.message.includes('Invalid redirect URL')) {
          throw new Error('URL de redirecionamento inválida. Verifique a configuração no Supabase.');
        } else if (error.message.includes('Provider not configured')) {
          throw new Error('Google OAuth não está configurado. Verifique a configuração no Supabase.');
        } else if (error.message.includes('Client ID not found')) {
          throw new Error('Client ID do Google não encontrado. Verifique a configuração no Supabase.');
        } else {
          throw new Error(`Erro no login com Google: ${error.message}`);
        }
      } else {
        throw new Error('Erro desconhecido no login com Google');
      }
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

  const register = async (email: string, password: string, _profileData?: any): Promise<void> => {
    setLoading(true);
    try {
      console.log('🔍 Debug - Iniciando registro de usuário:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('🔍 Debug - Erro no signUp:', error);
        throw error;
      }
      
      console.log('🔍 Debug - Usuário criado no auth:', data.user?.id);
      
      // NÃO tentar criar perfil aqui - será criado após confirmação do email
      // As políticas RLS impedem a criação durante o registro
      console.log('🔍 Debug - Usuário registrado. Perfil será criado após confirmação do email.');
      
      console.log('🔍 Debug - Registro concluído');
    } catch (error) {
      console.error('🔍 Debug - Erro no registro:', error);
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

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth };
