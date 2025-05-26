// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import supabase from "../utils/supabaseClient"; // Certifique-se de que este caminho está correto
import * as Sentry from "@sentry/react";

// Inicializar Sentry (mantido como no seu código original)
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
  const [loading, setLoading] = useState(true); // Indica se o carregamento inicial da sessão está completo
  const [authLoading, setAuthLoading] = useState(false); // Indica se alguma operação de autenticação está em andamento
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Função para limpar mensagens de feedback após um tempo
  const clearFeedback = useCallback(() => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 5000);
  }, []);

  // Função para buscar o perfil do usuário na tabela 'user_profile'
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      // Alterado de 'user' para 'user_profile'
      const { data: userData, error: dbError } = await supabase
        .from("user_profile") // CORRIGIDO: Nome da tabela
        .select("id, email, name, idjob, job, profile, date_singin") // Seleciona todas as colunas conforme sua definição
        .eq("id", userId) // Usar 'id' que corresponde ao auth.uid()
        .single();

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 indica que nenhuma linha foi encontrada
        console.error("Error fetching user profile from DB:", dbError);
        Sentry.captureException(dbError);
        return null;
      }
      return userData;
    } catch (err) {
      console.error("Unexpected error in fetchUserProfile:", err);
      Sentry.captureException(err);
      return null;
    }
  }, []);

  // Função para criar um novo perfil de usuário na tabela 'user_profile'
  const createUserProfile = useCallback(async (userAuthData) => {
    try {
      if (!userAuthData || !userAuthData.email || !userAuthData.id) {
        console.error("Invalid userAuthData object in createUserProfile: missing ID or email", userAuthData);
        return null;
      }

      // Tenta buscar o usuário pelo ID (UID do Supabase Auth) antes de inserir
      const { data: existingUser, error: queryError } = await supabase
        .from("user_profile") // CORRIGIDO: Nome da tabela
        .select("id")
        .eq("id", userAuthData.id)
        .single();

      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 means no rows found, other errors are real issues
        throw queryError;
      }

      if (!existingUser) {
        // Insere um novo perfil de usuário usando o UID do Supabase Auth como 'id'
        const { data, error } = await supabase.from("user_profile").insert({ // CORRIGIDO: Nome da tabela
          id: userAuthData.id, // O ID da tabela 'user_profile' deve ser o UID do Supabase Auth
          email: userAuthData.email,
          name: userAuthData.user_metadata?.full_name || userAuthData.email.split('@')[0], // Usando 'name'
          idjob: userAuthData.user_metadata?.matricula || null, // Definindo como null se não houver
          job: userAuthData.user_metadata?.cargo || null, // Definindo como null se não houver
          profile: userAuthData.user_metadata?.profile || "servidor", // Usando 'profile'
          date_singin: new Date().toISOString(),
        }).select(); // Adicionado .select() para retornar os dados inseridos

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
  }, [clearFeedback]);

  // Função para lidar com as mudanças de estado de autenticação
  const handleAuthChange = useCallback(async (event, session) => {
    console.log('Auth State Change Event:', event);
    console.log('Auth State Change Session:', session);
    setAuthLoading(true);
    setError(null);
    setMessage(null);

    if (session && session.user) {
      // Se a sessão existe e há um usuário, tentamos buscar o perfil do usuário
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
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0], // CORRIGIDO: Usando 'name'
          email: session.user.email,
          profile: "servidor", // CORRIGIDO: Usando 'profile'
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
  }, [fetchUserProfile, createUserProfile, clearFeedback]);

  // Efeito para lidar com a mudança inicial do estado de autenticação e configurar o listener
  useEffect(() => {
    // Tenta obter a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session ? "INITIAL_SESSION" : "SIGNED_OUT", session);
      setLoading(false); // Marca o carregamento inicial como completo
    }).catch((err) => {
      console.error("Error fetching initial session:", err);
      Sentry.captureException(err);
      setError("Erro ao carregar sessão inicial.");
      setLoading(false);
      clearFeedback();
    });

    // Configura o listener para mudanças de estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Limpa o listener na desmontagem do componente
    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [handleAuthChange, clearFeedback]); // Dependências do useEffect

  // Função de login com email e senha
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
      // O handleAuthChange será acionado automaticamente pelo listener
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

  // Função de login com Google OAuth
  const loginWithGoogle = async () => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard", // Redireciona para o dashboard após o login
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

  // Função de logout
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
      // O handleAuthChange será acionado automaticamente pelo listener
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

  // Função de registro de novo usuário
  const register = async (userInfo) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: { // Metadados do usuário que serão armazenados no Supabase Auth
            full_name: userInfo.nome, // Mapeia para 'name' na tabela user_profile
            matricula: userInfo.matricula, // Mapeia para 'idjob' na tabela user_profile
            cargo: userInfo.cargo, // Mapeia para 'job' na tabela user_profile
            profile: userInfo.profile || "servidor", // Mapeia para 'profile' na tabela user_profile
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.user) {
        // O perfil será criado automaticamente pelo handleAuthChange após o SIGNED_IN
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

  // Função para solicitar redefinição de senha
  const forgotPassword = async (email) => {
    setAuthLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password", // URL para onde o usuário será redirecionado após clicar no link do e-mail
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

  // Função para redefinir a senha (usada após o usuário clicar no link do e-mail)
  const resetPassword = async (newPassword) => { // Removido accessToken, pois updatePassword não o requer diretamente
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

  // Objeto de valor fornecido pelo contexto
  const value = {
    currentUser,
    loading, // Estado de carregamento inicial da sessão
    authLoading, // Estado de carregamento de operações de autenticação
    error,
    message,
    login,
    loginWithGoogle,
    logout,
    register,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!currentUser // Adiciona um booleano para verificar se o usuário está autenticado
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Renderiza os filhos apenas quando o carregamento inicial da sessão estiver completo */}
      {!loading && children}
      {/* Opcional: Pode adicionar um spinner de carregamento aqui se 'loading' for true */}
      {/* {loading && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>} */}
    </AuthContext.Provider>
  );
};
