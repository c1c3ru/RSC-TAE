import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase, { getSession, getCurrentUser } from '../utils/supabaseClient';

// Create Auth context
const AuthContext = createContext();

// Custom hook for using the auth context
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
  const [session, setSession] = useState(null);
  
  // Check if user is logged in on component mount & setup session listener
  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        // Get current session and user details
        const session = await getSession();
        setSession(session);
        
        if (session) {
          // Get user data from our database
          const { data: userData, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          if (!error && userData) {
            setCurrentUser(userData);
          } else if (session.user) {
            // If we don't have user data in our table yet but have authenticated user
            // Use basic info from auth
            setCurrentUser({
              id: session.user.id,
              nome: session.user.user_metadata?.full_name || session.user.email,
              email: session.user.email,
              perfil: 'servidor' // Default role
            });
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN') {
          // Get user data from our database
          const { data: userData, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', session.user.email)
            .single();
            
          if (!error && userData) {
            setCurrentUser(userData);
          } else if (session.user) {
            // If we don't have user data in our table yet
            setCurrentUser({
              id: session.user.id,
              nome: session.user.user_metadata?.full_name || session.user.email,
              email: session.user.email,
              perfil: 'servidor' // Default role
            });
            
            // Create user profile in our database
            await createUserProfile(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    initSession();
    
    // Cleanup auth listener on unmount
    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Create user profile in our database if it doesn't exist
  const createUserProfile = async (user) => {
    if (!user) return;
    
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (!existingUser) {
        // Insert new user
        const { error } = await supabase
          .from('usuarios')
          .insert({
            email: user.email,
            nome: user.user_metadata?.full_name || user.email,
            matricula: user.user_metadata?.matricula || '',
            cargo: user.user_metadata?.cargo || '',
            perfil: 'servidor',
            data_cadastro: new Date()
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };
  
  // Login with email and password
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  };
  
  // Login with Google
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  };
  
  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setCurrentUser(null);
    setSession(null);
  };
  
  // Register function
  const register = async (userInfo) => {
    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
      options: {
        data: {
          full_name: userInfo.nome,
          matricula: userInfo.matricula,
          cargo: userInfo.cargo
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Create user profile in our table
    await createUserProfile(data.user);
    
    return data.user;
  };
  
  // Forgot password function
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.' };
  };
  
  const value = {
    currentUser,
    session,
    loading,
    login,
    loginWithGoogle,
    logout,
    register,
    forgotPassword
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};