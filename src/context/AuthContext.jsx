import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import { motion } from "framer-motion";

// Create the Authentication Context
const AuthContext = createContext();

// Hook for using the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Function to map database user to app user format
  const mapUser = (user, metadata) => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      nome: metadata?.nome || metadata?.full_name || "Usuário",
      matricula: metadata?.matricula || "N/A",
      cargo: metadata?.cargo || "N/A",
      role: metadata?.profile || "user",
      createdAt: user.created_at
    };
  };

  // Check user session on component mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Get session and subscribe to auth changes
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUser(
          session?.user ? 
            mapUser(
              session.user, 
              session.user.user_metadata
            ) : null
        );

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event);
            if (session?.user) {
              setCurrentUser(mapUser(session.user, session.user.user_metadata));
            } else {
              setCurrentUser(null);
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign In function
  const login = async (email, password) => {
    clearMessages();
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: data.user ? mapUser(data.user, data.user.user_metadata) : null };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign In with Google
  const loginWithGoogle = async () => {
    clearMessages();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Up function
  const register = async (email, password, metadata) => {
    clearMessages();
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      if (data.user && !data.session) {
        setMessage("Verifique seu email para confirmar o cadastro.");
      }
      
      return { user: data.user ? mapUser(data.user, data.user.user_metadata) : null };
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Reset password function
  const forgotPassword = async (email) => {
    clearMessages();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      setMessage("Instruções para redefinição de senha enviadas para seu email.");
      return { success: true };
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Out function
  const logout = async () => {
    clearMessages();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  // Clear error and message states
  const clearMessages = () => {
    setError(null);
    setMessage("");
  };

  // Create context value object with memoization
  const value = {
    currentUser,
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    logout,
    loading,
    authLoading,
    error,
    message,
    clearMessages,
  };

  // Return provider with animated children
  return (
    <AuthContext.Provider value={value}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AuthContext.Provider>
  );
};