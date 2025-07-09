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
          // Verifica se já existe perfil
          let { data: profile, error: profileError } = await supabase
            .from('user_profile')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (!profile && !profileError) {
            const userMeta = session.user.user_metadata || {};
            const profileData = {
              id: session.user.id,
              name: userMeta.nome || userMeta.name || session.user.email,
              email: session.user.email,
              employee_number: userMeta.matricula || '',
              education: userMeta.escolaridade || '',
              functional_category: userMeta.profile || getProfileFromCargo(userMeta.profile || '')
            };
            const result = await tryCreateUserProfile(profileData);
            if (result !== true) {
              alert('Erro ao criar seu perfil. Tente novamente ou contate o suporte.');
              setCurrentUser(null);
              setLoading(false);
              return;
            }
            ({ data: profile } = await supabase
              .from('user_profile')
              .select('*')
              .eq('id', session.user.id)
              .single());
          }
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
      if (!redirectUrl || redirectUrl.includes(' ')) {
        console.error('❌ URL de redirecionamento inválida:', redirectUrl);
        throw new Error('URL de redirecionamento inválida');
      }
      // Inicia o login OAuth
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
        // Segunda tentativa sem queryParams extras
        const { data: data2, error: error2 } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: redirectUrl }
        });
        if (error2) throw error2;
        data = data2;
      }
      // Redireciona para o Google
      if (data?.url) {
        window.location.href = data.url;
      }
      // Após o redirecionamento e retorno, garantir que o perfil existe
      setTimeout(async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (user) {
          // Verifica se já existe perfil
          const { data: profile, error: profileError } = await supabase
            .from('user_profile')
            .select('id')
            .eq('id', user.id)
            .single();
          if (!profile && !profileError) {
            const userMeta = user.user_metadata || {};
            const profileData = {
              id: user.id,
              name: userMeta.nome || userMeta.name || user.email,
              email: user.email,
              employee_number: userMeta.matricula || '',
              education: userMeta.escolaridade || '',
              functional_category: userMeta.profile || getProfileFromCargo(userMeta.profile || '')
            };
            const result = await tryCreateUserProfile(profileData);
            if (result !== true) {
              alert('Erro ao criar seu perfil. Tente novamente ou contate o suporte.');
              setCurrentUser(null);
              setLoading(false);
              return;
            }
          }
        }
      }, 3000); // Aguarda 3s para garantir que o usuário está autenticado
      return data;
    } catch (error) {
      console.error('❌ Erro completo no login com Google:', error);
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
      console.log('[REGISTER] Dados recebidos para cadastro:', userInfo);
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: {
            name: userInfo.nome,
            employee_number: userInfo.matricula,
            functional_category: userInfo.profile || getProfileFromCargo(userInfo.profile)
          },
          emailRedirectTo: REDIRECT_URLS.dashboard()
        }
      });

      if (error) {
        console.error('[REGISTER] Erro ao criar usuário no Auth:', error);
        throw error;
      }

      // Cria o perfil do usuário no banco
      if (data.user) {
        console.log('[REGISTER] Usuário criado no Auth, id:', data.user.id);
        const { error: profileError } = await supabase
          .from('user_profile')
          .insert([
            {
              id: data.user.id,
              name: userInfo.nome,
              employee_number: userInfo.matricula,
              education: userInfo.escolaridade,
              email: userInfo.email,
              functional_category: userInfo.profile || getProfileFromCargo(userInfo.profile)
            }
          ]);
        if (profileError) {
          console.error('[REGISTER] Erro ao criar perfil no user_profile:', profileError, 'Dados enviados:', {
            id: data.user.id,
            name: userInfo.nome,
            employee_number: userInfo.matricula,
            education: userInfo.escolaridade,
            email: userInfo.email,
            functional_category: userInfo.profile || getProfileFromCargo(userInfo.profile)
          });
        } else {
          console.log('[REGISTER] Perfil criado com sucesso no user_profile para o usuário:', data.user.id);
        }
      }

      return data.user;
    } catch (error) {
      console.error('[REGISTER] Erro geral no cadastro:', error);
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

// Função utilitária para mapear cargo para profile
function getProfileFromCargo(cargo) {
  if (!cargo) return null;
  const cargoLower = cargo.toLowerCase();
  if (cargoLower.includes('assistente')) return 'assistente';
  if (cargoLower.includes('auxiliar')) return 'auxiliar';
  if (cargoLower.includes('técnico') || cargoLower.includes('tecnico')) return 'tecnico';
  if (cargoLower.includes('analista')) return 'analista';
  // Adicione outros conforme necessário
  return null;
}

// Função auxiliar para tentativas automáticas
async function tryCreateUserProfile(profileData, maxAttempts = 3) {
  let attempt = 0;
  let lastError = null;
  while (attempt < maxAttempts) {
    try {
      const { error } = await supabase.from('user_profile').insert([profileData]);
      if (!error) return true;
      lastError = error;
      // Simula log centralizado (ex: Sentry)
      console.error('[SENTRY] Erro ao criar perfil (tentativa ' + (attempt+1) + '):', error, profileData);
      // Se for erro de rede ou temporário, tenta novamente
      if (error.message && error.message.match(/timeout|network|temporário|temporary|ECONN/gi)) {
        await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
      } else {
        break; // Erro não recuperável
      }
    } catch (err) {
      lastError = err;
      console.error('[SENTRY] Exceção ao criar perfil (tentativa ' + (attempt+1) + '):', err, profileData);
      await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
    }
    attempt++;
  }
  return lastError;
}