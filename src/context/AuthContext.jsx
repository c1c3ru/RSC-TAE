import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { REDIRECT_URLS } from '../config/environment';

const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('user_profile')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setCurrentUser({
            ...session.user,
            ...profile
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('user_profile')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setCurrentUser({
            ...session.user,
            ...profile
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign in function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      const redirectUrl = REDIRECT_URLS.dashboard();
      
      // Validação adicional da URL
      if (!redirectUrl || redirectUrl.includes(' ')) {
        console.error('❌ URL de redirecionamento inválida:', redirectUrl);
        throw new Error('URL de redirecionamento inválida');
      }
      
      console.log('🔍 Debug - URL de redirecionamento:', redirectUrl);
      console.log('🔍 Debug - URL length:', redirectUrl.length);
      console.log('🔍 Debug - URL contains spaces:', redirectUrl.includes(' '));
      console.log('🔍 Debug - Ambiente:', import.meta.env.PROD ? 'PRODUÇÃO' : 'DESENVOLVIMENTO');
      console.log('🔍 Debug - URL atual:', window.location.origin);
      console.log('🔍 Debug - Supabase URL:', supabase.supabaseUrl);
      
      // Primeira tentativa com configuração padrão
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('❌ Erro na primeira tentativa:', error);
        
        // Segunda tentativa sem queryParams extras
        console.log('🔄 Tentando segunda vez sem queryParams extras...');
        const { data: data2, error: error2 } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl
          }
        });
        
        if (error2) {
          console.error('❌ Erro na segunda tentativa:', error2);
          throw error2;
        }
        
        data = data2;
      }
      
      console.log('✅ Resposta do Supabase:', data);
      console.log('🔗 URL de redirecionamento do Supabase:', data?.url);
      
      // Se chegou até aqui, redirecionar manualmente se necessário
      if (data?.url) {
        console.log('🚀 Redirecionando para:', data.url);
        window.location.href = data.url;
      }
      
      return data;
    } catch (error) {
      console.error('❌ Erro completo no login com Google:', error);
      
      // Mostrar erro amigável para o usuário
      if (error.message?.includes('500') || error.message?.includes('unexpected_failure')) {
        throw new Error('Erro temporário no servidor. Tente novamente em alguns minutos ou entre em contato com o suporte.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userInfo) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: {
            nome: userInfo.nome,
            matricula: userInfo.matricula,
            cargo: userInfo.cargo,
          },
          emailRedirectTo: REDIRECT_URLS.dashboard()
        }
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: data.user.id,
              nome: userInfo.nome,
              matricula: userInfo.matricula,
              cargo: userInfo.cargo,
              email: userInfo.email
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return data.user;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: REDIRECT_URLS.resetPassword()
      });

      if (error) throw error;

      return {
        message: 'E-mail de recuperação enviado! Verifique sua caixa de entrada.'
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};