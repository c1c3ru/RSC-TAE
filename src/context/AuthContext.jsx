// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../utils/supabaseClient"; // Assuming supabaseClient is correctly configured
import * as Sentry from "@sentry/react"; // Sentry is already integrated

// Initialize Sentry
Sentry.init({
  dsn: "https://ab89b790f40d94541025a759d3e66321@o4509356969885696.ingest.us.sentry.io/4509357025591296",
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
  const [authLoading, setAuthLoading] = useState(false); // New: Specific loading for auth actions
  const [error, setError] = useState(null); // New: Error state for auth actions
  const [message, setMessage] = useState(null); // New: Message state for auth actions

  // Helper to clear messages/errors after a delay
  const clearFeedback = () => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 5000); // Clear after 5 seconds
  };

  // Fetch user profile from our database
  const fetchUserProfile = async (userId) => {
    const { data: userData, error: dbError } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (dbError && dbError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Error fetching user profile from DB:", dbError);
      Sentry.captureException(dbError);
      return null;
    }
    return userData;
  };

  // Create user profile in our database if it doesn't exist
  const createUserProfile = async (user) => {
    try {
      if (!user || !user.email) {
        console.error("Invalid user object in createUserProfile");
        return null;
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
        const { data, error } = await supabase.from("user").insert({
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          idjob: user.user_metadata?.matricula || "",
          job: user.user_metadata?.cargo || "",
          profile: "servidor", // Default role
          date_singin: new Date().toISOString(),
        }).select(); // Select the newly inserted row

        if (error) throw error;
        console.log("User profile created successfully in DB.");
        return data ? data[0] : null; // Return the newly created user data
      }
      return existingUser; // Return existing user if found
    } catch (error) {
      console.error("Error creating user profile:", error.message);
      Sentry.captureException(error);
      setError("Erro ao criar perfil do usuário: " + error.message);
      clearFeedback();
      return null;
    }
  };

  // Check if user is logged in on component mount & setup session listener
  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      setAuthLoading(true); // Indicate auth listener is processing
      setError(null);
      setMessage(null);

      if (session) {
        let userProfile = await fetchUserProfile(session.user.id);

        if (!userProfile) {
          // If profile doesn't exist, create it.
          userProfile = await createUserProfile(session.user);
        }

        if (userProfile) {
          setCurrentUser(userProfile);
          if (event === "SIGNED_IN") {
            setMessage("Login bem-sucedido!");
            clearFeedback();
          }
        } else {
          // Fallback if profile creation/fetch also failed
          setCurrentUser({
            id: session.user.id,
            nome: session.user.user_metadata?.full_name || session.user.email,
            email: session.user.email,
            perfil: "servidor",
          });
          setError("Não foi possível carregar o perfil completo do usuário.");
          clearFeedback();
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        setMessage("Logout realizado com sucesso.");
        clearFeedback();
      }
      setAuthLoading(false); // Auth listener finished processing
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session ? "INITIAL_SESSION" : "SIGNED_OUT", session);
      setLoading(false); // Initial loading complete
    }).catch((err) => {
      console.error("Error fetching initial session:", err);
      Sentry.captureException(err);
      setError("Erro ao carregar sessão inicial.");
      setLoading(false);
      clearFeedback();
    });

    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Cleanup auth listener on unmount
    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // currentUser will be set by the onAuthStateChange listener
      return data.user;
    } catch (err) {
      console.error("Login error:", err);
      Sentry.captureException(err);
      setError("Credenciais inválidas. Tente novamente.");
      clearFeedback();
      throw err; // Re-throw to allow component to catch and handle
    } finally {
      setAuthLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard", // Ensure this matches your Supabase redirect URL
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      // currentUser will be set by the onAuthStateChange listener
      return data;
    } catch (err) {
      console.error("Google login error:", err);
      Sentry.captureException(err);
      setError("Erro ao realizar login com Google. Por favor, tente novamente.");
      clearFeedback();
      throw err; // Re-throw to allow component to catch and handle
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      // currentUser will be set to null by the onAuthStateChange listener
    } catch (err) {
      console.error("Logout error:", err);
      Sentry.captureException(err);
      setError("Erro ao realizar logout.");
      clearFeedback();
      throw err; // Re-throw to allow component to catch and handle
    } finally {
      setAuthLoading(false);
    }
  };

  // Register function
  const register = async (userInfo) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
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
        // The onAuthStateChange listener will handle setting currentUser
        // and creating the profile in the 'user' table if it doesn't exist.
        setMessage("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar e fazer login.");
        clearFeedback();
        return data.user;
      } else {
        throw new Error("Registro falhou: nenhum dado de usuário retornado.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      Sentry.captureException(err);
      setError(err.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      clearFeedback();
      throw err; // Re-throw to allow component to catch and handle
    } finally {
      setAuthLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password", // Ensure this URL is handled by your app
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
      clearFeedback();
      return { success: true };
    } catch (err) {
      console.error("Password reset error:", err);
      Sentry.captureException(err);
      setError(err.message || "Erro ao processar a solicitação de redefinição de senha. Tente novamente.");
      clearFeedback();
      throw err; // Re-throw to allow component to catch and handle
    } finally {
      setAuthLoading(false);
    }
  };

  // New function to handle password reset after clicking the link in the email
  const resetPassword = async (accessToken, newPassword) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      // Supabase's update user function is used here.
      // The access token is usually parsed from the URL of the redirect.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Sua senha foi redefinida com sucesso. Você pode fazer login agora.");
      clearFeedback();
      return { success: true };
    } catch (err) {
      console.error("Reset password error:", err);
      Sentry.captureException(err);
      setError(err.message || "Erro ao redefinir a senha. Por favor, tente novamente.");
      clearFeedback();
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };


  const value = {
    currentUser,
    loading, // Initial app loading
    authLoading, // Loading for auth actions
    error,
    message,
    login,
    loginWithGoogle,
    logout,
    register,
    forgotPassword,
    resetPassword, // Added resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};