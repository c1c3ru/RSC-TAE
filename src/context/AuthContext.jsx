import React, { createContext, useContext, useState, useEffect } from "react";
import supabase, { getSession, getCurrentUser } from "../utils/supabaseClient";
import * as Sentry from "@sentry/react";

// Inicializar Sentry
Sentry.init({
  dsn: "https://bf02dce9f9a21a35c05737124bd267af@o4509356969885696.ingest.us.sentry.io/4509356970803200",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

// Create Auth context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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
            .from("user")
            .select("*")
            .eq("email", session.user.email)
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
              perfil: "servidor", // Default role
            });
          }
        }
      } catch (error) {
        console.error("Error initializing session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (event === "SIGNED_IN") {
          try {
            // Get user data from our database
            const { data: userData, error } = await supabase
              .from("user")
              .select("*")
              .eq("email", session.user.email)
              .single();

            if (!error && userData) {
              setCurrentUser(userData);
            } else if (session.user) {
              // If we don't have user data in our table yet
              setCurrentUser({
                id: session.user.id,
                nome: session.user.user_metadata?.full_name || session.user.email,
                email: session.user.email,
                perfil: "servidor", // Default role
              });

              // Create user profile in our database
              await createUserProfile(session.user);
            }
          } catch (error) {
            console.error("Error during sign-in:", error);
          }
        } else if (event === "SIGNED_OUT") {
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
    try {
      if (!user || !user.email) {
        console.error("Invalid user object in createUserProfile");
        return;
      }
      
      const { data: existingUser, error: queryError } = await supabase
        .from("user")
        .select("id")
        .eq("email", user.email)
        .single();
        
      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      if (!existingUser) {
        const { error } = await supabase.from("user").insert({
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          idjob: user.user_metadata?.matricula || "",
          job: user.user_metadata?.cargo || "",
          profile: "servidor",
          date_singin: new Date().toISOString(),
        });
        
        if (error) throw error;
        console.log("Usuário inserido com sucesso na tabela user");
      }
    } catch (error) {
      console.error("Erro ao criar perfil do usuário:", error.message);
      // We're handling the error here so it won't propagate and break the flow
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      setCurrentUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Register function
  const register = async (userInfo) => {
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: {
            full_name: userInfo.nome,
            matricula: userInfo.matricula,
            cargo: userInfo.cargo,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.user) {
        // Create user profile in our table
        await createUserProfile(data.user);
        return data.user;
      } else {
        throw new Error("Registration failed: No user data returned");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        message:
          "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.",
      };
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    session,
    loading,
    login,
    loginWithGoogle,
    logout,
    register,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};