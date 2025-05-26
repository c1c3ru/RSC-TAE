import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import * as Sentry from "@sentry/react";

// Inicializar Sentry
Sentry.init({
  dsn: "https://ab89b790f40d94541025a759d3e66321@o4509356969885696.ingest.us.sentry.io/4509357025591296",
  sendDefaultPii: true,
});

// Create Auth context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const clearFeedback = () => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 5000);
  };

  const fetchUserProfile = async (userId) => {
    const { data: userData, error: dbError } = await supabase
      .from("user_profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error("Error fetching user profile from DB:", dbError);
      Sentry.captureException(dbError);
      return null;
    }
    return userData;
  };

  const createUserProfile = async (user) => {
    try {
      if (!user || !user.email || !user.id) {
        console.error("Invalid user object in createUserProfile: missing ID or email", user);
        return null;
      }
      
      const { data: existingUser, error: queryError } = await supabase
        .from("user_profile")
        .select("id")
        .eq("id", user.id)
        .single();
        
      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      if (!existingUser) {
        const { data, error } = await supabase.from("user_profile").insert({
          id: user.id,
          email: user.email,
          // Certifique-se de que 'name', 'idjob', 'job' correspondem às suas colunas no DB
          name: user.user_metadata?.full_name || user.email, 
          idjob: user.user_metadata?.matricula || "", // Assumindo 'idjob' é a matrícula
          job: user.user_metadata?.cargo || "", // Assumindo 'job' é o cargo
          profile: "servidor",
          date_singin: new Date().toISOString(),
        }).select();

        if (error) throw error;
        console.log("User profile created successfully in DB with ID:", data[0].id);
        return data ? data[0] : null;
      }
      console.log("User profile already exists in DB with ID:", existingUser.id);
      return existingUser;
    } catch (error) {
      console.error("Erro ao criar perfil do usuário:", error.message);
      Sentry.captureException(error);
      setError("Erro ao criar perfil do usuário: " + error.message);
      clearFeedback();
      return null;
    }
  };

  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      console.log('Auth State Change Event:', event);
      console.log('Auth State Change Session:', session);
      setAuthLoading(true);
      setError(null);
      setMessage(null);

      if (session) {
        let userProfile = await fetchUserProfile(session.user.id);

        if (!userProfile) {
          console.log('User profile not found in DB, attempting to create...');
          userProfile = await createUserProfile(session.user);
        }

        if (userProfile) {
          // Garante que o currentUser tenha todas as propriedades do userProfile, incluindo 'idjob' e 'job'
          setCurrentUser({
            id: userProfile.id,
            nome: userProfile.name || session.user.user_metadata?.full_name || session.user.email,
            email: userProfile.email || session.user.email,
            matricula: userProfile.idjob || 'N/A', // Mapeia idjob para matricula
            cargo: userProfile.job || 'N/A',     // Mapeia job para cargo
            perfil: userProfile.profile || 'servidor',
            // Adicione outras propriedades que você possa precisar do userProfile
          });
          console.log('Current User set:', currentUser); // Note: currentUser aqui pode ser o valor antigo antes do setState
          if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
            setMessage("Login bem-sucedido!");
            clearFeedback();
          }
        } else {
          // Fallback se o perfil não puder ser carregado/criado
          setCurrentUser({
            id: session.user.id,
            nome: session.user.user_metadata?.full_name || session.user.email,
            email: session.user.email,
            matricula: 'N/A',
            cargo: 'N/A',
            perfil: "servidor",
          });
          setError("Não foi possível carregar o perfil completo do usuário.");
          clearFeedback();
          console.warn('Fallback: Current User set with basic session info.');
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        setMessage("Logout realizado com sucesso.");
        clearFeedback();
        console.log('User signed out.');
      }
      setAuthLoading(false);
    };

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthChange("INITIAL_SESSION", session);
      } else {
        setLoading(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Dummy implementations for missing functions
  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage("Login bem-sucedido!");
      clearFeedback();
    } catch (err) {
      setError(err.message || "Erro ao fazer login.");
      clearFeedback();
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw error;
      setMessage("Redirecionando para login com Google...");
      clearFeedback();
    } catch (err) {
      setError(err.message || "Erro ao fazer login com Google.");
      clearFeedback();
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage("Logout realizado com sucesso.");
      clearFeedback();
    } catch (err) {
      setError(err.message || "Erro ao fazer logout.");
      clearFeedback();
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email, password, user_metadata = {}) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: user_metadata },
      });
      if (error) throw error;
      setMessage("Cadastro realizado com sucesso! Verifique seu e-mail.");
      clearFeedback();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar.");
      clearFeedback();
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage("E-mail de redefinição de senha enviado.");
      clearFeedback();
    } catch (err) {
      setError(err.message || "Erro ao solicitar redefinição de senha.");
      clearFeedback();
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (accessToken, newPassword) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Sua senha foi redefinida com sucesso. Você pode fazer login agora.");
      clearFeedback();
      console.log('Password reset successful.');
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
    loading,
    authLoading,
    error,
    message,
    login,
    loginWithGoogle,
    logout,
    register,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
