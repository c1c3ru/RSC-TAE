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
    // Certifique-se de que a coluna 'id' na sua tabela 'user' é o UID do Supabase Auth
    const { data: userData, error: dbError } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId) // Usar 'id' que corresponde ao auth.uid()
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
      if (!user || !user.email || !user.id) { // user.id é o UID do Supabase Auth
        console.error("Invalid user object in createUserProfile: missing ID or email", user);
        return null;
      }
      
      // Tenta buscar o usuário pelo ID (UID do Supabase Auth)
      const { data: existingUser, error: queryError } = await supabase
        .from("user")
        .select("id")
        .eq("id", user.id) // Busca pelo UID do Supabase Auth
        .single();
        
      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw queryError;
      }

      if (!existingUser) {
        // Insere um novo perfil de usuário usando o UID do Supabase Auth como 'id'
        const { data, error } = await supabase.from("user").insert({
          id: user.id, // O ID da tabela 'user' deve ser o UID do Supabase Auth
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
          idjob: user.user_metadata?.matricula || "",
          job: user.user_metadata?.cargo || "",
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
        // Se a sessão existe, tentamos buscar o perfil do usuário
        let userProfile = await fetchUserProfile(session.user.id);

        if (!userProfile) {
          console.log('User profile not found in DB, attempting to create...');
          // Se não encontrou, tenta criar o perfil
          userProfile = await createUserProfile(session.user);
        }

        if (userProfile) {
          setCurrentUser(userProfile);
          console.log('Current User set:', userProfile);
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session ? "INITIAL_SESSION" : "SIGNED_OUT", session);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching initial session:", err);
      Sentry.captureException(err);
      setError("Erro ao carregar sessão inicial.");
      setLoading(false);
      clearFeedback();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

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
      console.log('Login with password successful (data):', data);
      return data.user;
    } catch (err) {
      console.error("Login error:", err);
      Sentry.captureException(err);
      setError("Credenciais inválidas. Tente novamente.");
      clearFeedback();
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
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
      console.log('Initiated Google login (data):', data);
      return data;
    } catch (err) {
      console.error("Google login error:", err);
      Sentry.captureException(err);
      setError('Erro ao realizar login com Google. Por favor, tente novamente.');
      clearFeedback();
      throw err;
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
      if (error) {
        throw new Error(error.message);
      }
      console.log('Logout successful.');
    } catch (err) {
      console.error("Logout error:", err);
      Sentry.captureException(err);
      setError("Erro ao realizar logout.");
      clearFeedback();
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

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
        setMessage("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar e fazer login.");
        clearFeedback();
        console.log('Registration successful (user):', data.user);
        return data.user;
      } else {
        throw new Error("Registro falhou: nenhum dado de usuário retornado.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      Sentry.captureException(err);
      setError(err.message || "Erro ao realizar cadastro. Por favor, tente novamente.");
      clearFeedback();
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
      clearFeedback();
      console.log('Forgot password email sent to:', email);
      return { success: true };
    } catch (err) {
      console.error("Password reset error:", err);
      Sentry.captureException(err);
      setError(err.message || "Erro ao processar a solicitação de redefinição de senha. Tente novamente.");
      clearFeedback();
      throw err;
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
      {/* Renderiza os filhos apenas quando não estiver carregando */}
      {!loading && children} 
      {/* Ou, se preferir, pode mostrar um spinner de carregamento aqui */}
      {/* {loading && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>} */}
    </AuthContext.Provider>
  );
};
