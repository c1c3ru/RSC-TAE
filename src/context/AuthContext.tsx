import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import supabase from '../utils/supabaseClient';
import { REDIRECT_URLS } from '../config/environment';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

// Tipos principais
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  employee_number?: string;
  education?: string;
  functional_category?: string;
  [key: string]: any;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    user_metadata?: any;
    [key: string]: any;
  };
  [key: string]: any;
}

interface LoadingState {
  session: boolean;
  authenticating: boolean;
  signingOut: boolean;
  profile: boolean;
  creatingProfile: boolean;
  any: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: LoadingState;
  error: any;
  clearError: () => void;
  login: (email: string, password: string) => Promise<any>;
  register: (userInfo: any) => Promise<any>;
  logout: () => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  onError?: (error: any) => void;
}

function getProfileFromCargo(cargo: string | undefined): string | null {
  if (!cargo) return null;
  const cargoLower = cargo.toLowerCase();
  if (cargoLower.includes('assistente')) return 'assistente';
  if (cargoLower.includes('auxiliar')) return 'auxiliar';
  if (cargoLower.includes('técnico') || cargoLower.includes('tecnico')) return 'tecnico';
  if (cargoLower.includes('analista')) return 'analista';
  return null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onError }) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    session: true,
    authenticating: false,
    signingOut: false,
    profile: false,
    creatingProfile: false,
    any: true,
  });
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('[AuthContext] Montando AuthProvider...');
  }, []);

  useEffect(() => {
    const anyLoading = Object.values(loading).some(status => status === true);
    if (anyLoading !== loading.any) {
      setLoading(prev => ({ ...prev, any: anyLoading }));
    }
  }, [loading]);

  const clearError = useCallback(() => setError(null), []);

  const handleAuthError = useCallback((err: any, context = '') => {
    console.error(`[AUTH ERROR] Context: ${context}`, err);
    const errorMessage = { message: err.message || 'Ocorreu um erro.', context };
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
    return { success: false, error: errorMessage };
  }, [onError]);

  const fetchUserProfile = useCallback(async (user: User) => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null): Promise<void> => {
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(prev => ({ ...prev, creatingProfile: true }));
          const { data: profile } = await supabase.from('user_profile').select('id').eq('id', session.user.id).maybeSingle();
          if (!profile) {
            console.log('[AUTH] Perfil não encontrado, criando...');
            const userMeta = session.user.user_metadata || {};
            const profileData = {
              id: session.user.id,
              name: userMeta.name ?? session.user.email ?? '',
              email: session.user.email ?? '',
              employee_number: userMeta.employee_number || '',
              education: userMeta.escolaridade || '',
              functional_category: userMeta.functional_category || getProfileFromCargo(userMeta.functional_category || '')
            };
            const { error: insertError } = await supabase.from('user_profile').insert(profileData);
            if (insertError) {
              await supabase.auth.signOut();
              handleAuthError(insertError, 'Profile Creation');
              return;
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

  const login = async (email: string, password: string) => {
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

  const register = async (userInfo: any) => {
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

  const forgotPassword = async (email: string) => {
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

  const value: AuthContextType = {
    isAuthenticated: !!userSession,
    currentUser: userSession?.user ?? null,
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