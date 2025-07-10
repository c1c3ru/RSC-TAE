import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabaseClient';
import { REDIRECT_URLS } from '../config/environment';

const AuthContext = createContext();

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Função utilitária para mapear cargo
function getProfileFromCargo(cargo) {
  if (!cargo) return null;
  const cargoLower = cargo.toLowerCase();
  if (cargoLower.includes('assistente')) return 'assistente';
  if (cargoLower.includes('auxiliar')) return 'auxiliar';
  if (cargoLower.includes('técnico') || cargoLower.includes('tecnico')) return 'tecnico';
  if (cargoLower.includes('analista')) return 'analista';
  return null;
}

// Componente AuthProvider
export const AuthProvider = ({ children, onError }) => {
  const [userSession, setUserSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState({
    session: true,
    authenticating: false,
    signingOut: false,
    profile: false,
    creatingProfile: false,
    any: true, // Um estado geral para saber se qualquer loading está ativo
  });
  const [error, setError] = useState(null);

  // Atualiza o estado de loading geral
  useEffect(() => {
    const anyLoading = Object.values(loading).some(status => status === true);
    if (anyLoading !== loading.any) {
      setLoading(prev => ({...prev, any: anyLoading}));
    }
  }, [loading]);

  const clearError = useCallback(() => setError(null), []);

  const handleAuthError = useCallback((err, context) => {
    console.error(`[AUTH ERROR] Context: ${context}`, err);
    const errorMessage = { message: err.message || 'Ocorreu um erro.', context };
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
    return { success: false, error: errorMessage };
  }, [onError]);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setUserProfile(null);
      return null;
    }
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const { data, error: fetchError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      setUserProfile(data);
      return data;
    } catch (err) {
      handleAuthError(err, 'Fetching Profile');
      return null;
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [handleAuthError]);

  useEffect(() => {
    // Busca a sessão inicial
    const getInitialSession = async () => {
      setLoading(prev => ({ ...prev, session: true }));
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        handleAuthError(sessionError, 'Session Initialization');
      } else if (session?.user) {
        setUserSession(session);
        await fetchUserProfile(session.user);
      }
      setLoading(prev => ({ ...prev, session: false }));
    };

    getInitialSession();

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(prev => ({ ...prev, creatingProfile: true }));
          const { data: profile } = await supabase.from('user_profile').select('id').eq('id', session.user.id).maybeSingle();
          
          if (!profile) {
            console.log('[AUTH] Perfil não encontrado, criando...');
            const userMeta = session.user.user_metadata || {};
            const profileData = {
              id: session.user.id,
              name: userMeta.name || session.user.email,
              email: session.user.email,
              employee_number: userMeta.employee_number || '',
              education: userMeta.escolaridade || '',
              functional_category: userMeta.functional_category || getProfileFromCargo(userMeta.functional_category || '')
            };
            const { error: insertError } = await supabase.from('user_profile').insert(profileData);
            if (insertError) {
              await supabase.auth.signOut();
              return handleAuthError(insertError, 'Profile Creation');
            }
          }
          setUserSession(session);
          await fetchUserProfile(session.user);
          setLoading(prev => ({ ...prev, creatingProfile: false }));
        } else if (event === 'SIGNED_OUT') {
          setUserSession(null);
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, handleAuthError]);

  // Funções de autenticação
  const login = async (email, password) => {
    setLoading(prev => ({ ...prev, authenticating: true }));
    clearError();
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;
      return { success: true };
    } catch (err) {
      return handleAuthError(err, 'Login');
    } finally {
      setLoading(prev => ({ ...prev, authenticating: false }));
    }
  };

  const register = async (userInfo) => {
    setLoading(prev => ({ ...prev, authenticating: true }));
    clearError();
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: {
            name: userInfo.name,
            employee_number: userInfo.employee_number,
            functional_category: userInfo.functional_category
          },
          emailRedirectTo: REDIRECT_URLS.login()
        }
      });
      if (signUpError) throw signUpError;
      return { success: true };
    } catch (err) {
      return handleAuthError(err, 'Registration');
    } finally {
      setLoading(prev => ({ ...prev, authenticating: false }));
    }
  };

  const logout = async () => {
    setLoading(prev => ({ ...prev, signingOut: true }));
    clearError();
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      return { success: true };
    } catch (err) {
      return handleAuthError(err, 'Logout');
    } finally {
      setLoading(prev => ({ ...prev, signingOut: false }));
    }
  };
  
  const forgotPassword = async (email) => {
    setLoading(prev => ({ ...prev, authenticating: true }));
    clearError();
    try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: REDIRECT_URLS.resetPassword()
        });
        if (resetError) throw resetError;
        return { success: true };
    } catch (err) {
        return handleAuthError(err, 'Password Reset');
    } finally {
        setLoading(prev => ({ ...prev, authenticating: false }));
    }
  };

  const value = {
    isAuthenticated: !!userSession,
    currentUser: userSession?.user,
    userProfile,
    loading,
    error,
    clearError,
    login,
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