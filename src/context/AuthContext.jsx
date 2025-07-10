import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import supabase from '../utils/supabaseClient';
import { REDIRECT_URLS } from '../config/environment';

// Types for better type safety (consider migrating to TypeScript)
const LoadingStates = {
  IDLE: 'idle',
  AUTHENTICATING: 'authenticating',
  LOADING_PROFILE: 'loading_profile',
  CREATING_PROFILE: 'creating_profile',
  SIGNING_OUT: 'signing_out'
};

const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value
 * @throws {Error} When used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages user authentication state and provides auth methods
 */
export const AuthProvider = ({ children, onError = null }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingState, setLoadingState] = useState(LoadingStates.IDLE);
  const [error, setError] = useState(null);

  // Computed loading states for better UX
  const loading = useMemo(() => ({
    any: loadingState !== LoadingStates.IDLE,
    authenticating: loadingState === LoadingStates.AUTHENTICATING,
    profile: loadingState === LoadingStates.LOADING_PROFILE,
    creatingProfile: loadingState === LoadingStates.CREATING_PROFILE,
    signingOut: loadingState === LoadingStates.SIGNING_OUT
  }), [loadingState]);

  /**
   * Centralized error handler
   */
  const handleError = useCallback((error, context = '') => {
    const errorMessage = error?.message || 'Unknown error occurred';
    const fullError = { message: errorMessage, context, timestamp: new Date().toISOString() };
    
    // Only log in development
    if (import.meta.env.MODE === 'development') {
      console.error(`[AuthContext${context ? ` - ${context}` : ''}]:`, error);
    }
    
    setError(fullError);
    onError?.(fullError);
    return fullError;
  }, [onError]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Validate user input data
   */
  const validateUserData = useCallback((userData) => {
    const errors = [];
    
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Valid email is required');
    }
    
    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    return errors;
  }, []);

  /**
   * Get profile category from job title
   */
  const getProfileFromJobTitle = useCallback((jobTitle) => {
    if (!jobTitle) return null;
    
    const titleLower = jobTitle.toLowerCase();
    const profileMap = {
      'assistente': 'assistant',
      'auxiliar': 'auxiliary',
      'técnico': 'technician',
      'tecnico': 'technician',
      'analista': 'analyst'
    };
    
    for (const [key, value] of Object.entries(profileMap)) {
      if (titleLower.includes(key)) return value;
    }
    
    return null;
  }, []);

  /**
   * Create user profile with retry logic
   */
  const createUserProfile = useCallback(async (profileData, maxAttempts = 3) => {
    let attempt = 0;
    let lastError = null;

    while (attempt < maxAttempts) {
      try {
        const { error } = await supabase
          .from('user_profile')
          .insert([profileData]);
        
        if (!error) return { success: true };
        
        lastError = error;
        
        // Retry only for network/temporary errors
        if (error.message?.match(/timeout|network|temporary|ECONN/gi)) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        } else {
          break; // Non-recoverable error
        }
      } catch (err) {
        lastError = err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
      attempt++;
    }
    
    return { success: false, error: lastError };
  }, []);

  /**
   * Fetch or create user profile
   */
  const ensureUserProfile = useCallback(async (user) => {
    try {
      setLoadingState(LoadingStates.LOADING_PROFILE);
      
      // Try to fetch existing profile
      const { data: profile, error: fetchError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile && !fetchError) {
        return { success: true, profile };
      }

      // Create profile if it doesn't exist
      setLoadingState(LoadingStates.CREATING_PROFILE);
      
      const userMeta = user.user_metadata || {};
      const profileData = {
        id: user.id,
        name: userMeta.name || userMeta.nome || user.email,
        email: user.email,
        employee_number: userMeta.employee_number || userMeta.matricula || '',
        education: userMeta.education || userMeta.escolaridade || '',
        functional_category: userMeta.functional_category || 
                           getProfileFromJobTitle(userMeta.profile || '')
      };

      const createResult = await createUserProfile(profileData);
      
      if (!createResult.success) {
        return { 
          success: false, 
          error: 'Failed to create user profile after multiple attempts' 
        };
      }

      // Fetch the newly created profile
      const { data: newProfile, error: newFetchError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (newProfile && !newFetchError) {
        return { success: true, profile: newProfile };
      }

      return { success: false, error: 'Profile created but could not be retrieved' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [createUserProfile, getProfileFromJobTitle]);

  /**
   * Update current user state with profile data
   */
  const updateUserState = useCallback(async (user) => {
    if (!user) {
      setCurrentUser(null);
      return;
    }

    const profileResult = await ensureUserProfile(user);
    
    if (profileResult.success) {
      setCurrentUser({
        ...user,
        ...profileResult.profile
      });
    } else {
      handleError(new Error(profileResult.error), 'Profile Management');
      setCurrentUser(null);
      return false;
    }
    
    return true;
  }, [ensureUserProfile, handleError]);

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoadingState(LoadingStates.LOADING_PROFILE);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          handleError(error, 'Session Initialization');
          return;
        }

        if (mounted) {
          if (session?.user) {
            await updateUserState(session.user);
          } else {
            setCurrentUser(null);
          }
        }
      } catch (error) {
        if (mounted) {
          handleError(error, 'Auth Initialization');
        }
      } finally {
        if (mounted) {
          setLoadingState(LoadingStates.IDLE);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          setLoadingState(LoadingStates.LOADING_PROFILE);
          
          if (session?.user) {
            const success = await updateUserState(session.user);
            if (!success && event === 'SIGNED_IN') {
              // Handle profile creation failure
              await supabase.auth.signOut();
              return;
            }
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          handleError(error, 'Auth State Change');
        } finally {
          setLoadingState(LoadingStates.IDLE);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateUserState, handleError]);

  /**
   * Sign in with email and password
   */
  const login = useCallback(async (email, password) => {
    try {
      clearError();
      
      const validationErrors = validateUserData({ email, password });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      setLoadingState(LoadingStates.AUTHENTICATING);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      const handledError = handleError(error, 'Email Login');
      return { success: false, error: handledError };
    } finally {
      setLoadingState(LoadingStates.IDLE);
    }
  }, [validateUserData, handleError, clearError]);

  /**
   * Sign in with Google OAuth
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      clearError();
      setLoadingState(LoadingStates.AUTHENTICATING);
      
      const redirectUrl = REDIRECT_URLS.dashboard();
      
      if (!redirectUrl || redirectUrl.includes(' ')) {
        throw new Error('Invalid redirect URL configuration');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
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
        // Fallback without extra query params
        const { data: fallbackData, error: fallbackError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: redirectUrl }
        });
        
        if (fallbackError) throw fallbackError;
        return { success: true, url: fallbackData.url };
      }

      return { success: true, url: data.url };
    } catch (error) {
      const handledError = handleError(error, 'Google Login');
      return { success: false, error: handledError };
    } finally {
      setLoadingState(LoadingStates.IDLE);
    }
  }, [handleError, clearError]);

  /**
   * Register new user
   */
  const register = useCallback(async (userInfo) => {
    try {
      clearError();
      
      const validationErrors = validateUserData(userInfo);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      setLoadingState(LoadingStates.AUTHENTICATING);
      
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email.trim(),
        password: userInfo.password,
        options: {
          data: {
            name: userInfo.name || userInfo.nome,
            employee_number: userInfo.employee_number || userInfo.matricula,
            functional_category: userInfo.functional_category || 
                               getProfileFromJobTitle(userInfo.profile || '')
          },
          emailRedirectTo: REDIRECT_URLS.login()
        }
      });

      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      const handledError = handleError(error, 'Registration');
      return { success: false, error: handledError };
    } finally {
      setLoadingState(LoadingStates.IDLE);
    }
  }, [validateUserData, getProfileFromJobTitle, handleError, clearError]);

  /**
   * Sign out current user
   */
  const logout = useCallback(async () => {
    try {
      clearError();
      setLoadingState(LoadingStates.SIGNING_OUT);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      const handledError = handleError(error, 'Logout');
      return { success: false, error: handledError };
    } finally {
      setLoadingState(LoadingStates.IDLE);
    }
  }, [handleError, clearError]);

  /**
   * Send password reset email
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      clearError();
      
      const validationErrors = validateUserData({ email });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: REDIRECT_URLS.resetPassword()
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      const handledError = handleError(error, 'Password Reset');
      return { success: false, error: handledError };
    }
  }, [validateUserData, handleError, clearError]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    currentUser,
    loading,
    error,
    
    // Actions
    login,
    loginWithGoogle,
    register,
    logout,
    forgotPassword,
    clearError,
    
    // Utilities
    isAuthenticated: !!currentUser,
    userProfile: currentUser ? {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      employeeNumber: currentUser.employee_number,
      education: currentUser.education,
      functionalCategory: currentUser.functional_category
    } : null
  }), [
    currentUser,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    forgotPassword,
    clearError
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;