import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  // Modos da UI
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Campos de Registro
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMatricula, setRegisterMatricula] = useState("");
  const [registerCargo, setRegisterCargo] = useState("");

  const {
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    authLoading,
    error: contextError,
    message: contextMessage
  } = useAuth();
  const navigate = useNavigate();

  // Efeito para animação de entrada
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Sincroniza erros e mensagens do contexto para o estado local
  useEffect(() => {
    if (contextError) setLocalError(contextError);
  }, [contextError]);

  useEffect(() => {
    if (contextMessage) setLocalMessage(contextMessage);
  }, [contextMessage]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalMessage("");

    if (isForgotPassword) {
      if (!email) return setLocalError("Digite seu e-mail para recuperar a senha.");
      await forgotPassword(email);
      return;
    }

    if (isRegister) {
      if (!registerName || !registerEmail || !registerPassword || !registerMatricula || !registerCargo) {
        return setLocalError("Preencha todos os campos para o cadastro.");
      }
      const metadata = {
        full_name: registerName,
        matricula: registerMatricula,
        cargo: registerCargo,
      };
      
      const { error } = await register(registerEmail, registerPassword, metadata);
      if (!error) {
        toggleMode('login'); // Volta para a tela de login após sucesso
        setEmail(registerEmail); // Preenche o email para facilitar
        setLocalMessage("Cadastro realizado! Verifique seu e-mail para confirmar.");
      }
      return;
    }

    // Modo Login Padrão
    if (!email || !password) return setLocalError("Preencha e-mail e senha.");

    const { error } = await login(email, password);
    if (!error) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const toggleMode = (mode) => {
    setFadeIn(false);
    setTimeout(() => {
      setIsRegister(mode === 'register');
      setIsForgotPassword(mode === 'forgot');
      setLocalError("");
      setLocalMessage("");
      setFadeIn(true);
    }, 300);
  };

  // ----- INÍCIO DO JSX QUE SERÁ RENDERIZADO -----
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <div
        className={`max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          fadeIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          <h1 className="text-white text-center text-3xl font-bold relative z-10">Sistema de Pontuação</h1>
          <p className="text-blue-100 text-center mt-2 relative z-10">Progressão Funcional</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {isForgotPassword ? "Recuperar Senha" : isRegister ? "Cadastre-se" : "Login"}
          </h2>

          {localError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
              {localError}
            </div>
          )}

          {localMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
              {localMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {isRegister ? (
              // FORMULÁRIO DE REGISTRO
              <>
                {/* Campos de Nome, Email, Senha, Matrícula, Cargo aqui */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-name">Nome Completo</label>
                  <input id="register-name" type="text" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-email">E-mail</label>
                    <input id="register-email" type="email" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-password">Senha</label>
                    <input id="register-password" type="password" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-matricula">Matrícula</label>
                        <input id="register-matricula" type="text" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" value={registerMatricula} onChange={(e) => setRegisterMatricula(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-cargo">Cargo</label>
                        <input id="register-cargo" type="text" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" value={registerCargo} onChange={(e) => setRegisterCargo(e.target.value)} />
                    </div>
                </div>
              </>
            ) : (
              // FORMULÁRIO DE LOGIN E RECUPERAÇÃO DE SENHA
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">E-mail</label>
                  <input id="email" type="email" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {!isForgotPassword && (
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Senha</label>
                    <input id="password" type="password" className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                )}
              </>
            )}

            <div className="mb-4">
              <button type="submit" className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none shadow-md transition-transform hover:scale-[1.02] ${authLoading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={authLoading}>
                {authLoading ? "Processando..." : (isForgotPassword ? "Enviar E-mail" : isRegister ? "Criar Conta" : "Entrar")}
              </button>
            </div>
            
            {!isRegister && !isForgotPassword && (
                <>
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <div className="px-3 text-sm text-gray-500">ou</div>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 shadow-sm transition-transform hover:scale-[1.02]" disabled={authLoading}>
                        {/* Ícone do Google aqui */}
                        Continuar com Google
                    </button>
                </>
            )}

            <div className="flex justify-center space-x-4 text-sm mt-6">
              <button type="button" onClick={() => toggleMode(isForgotPassword ? 'login' : 'forgot')} className="text-blue-700 hover:underline">
                {isForgotPassword ? "Voltar para Login" : "Esqueceu a senha?"}
              </button>
              <span className="text-gray-400">|</span>
              <button type="button" onClick={() => toggleMode(isRegister ? 'login' : 'register')} className="text-blue-700 hover:underline">
                {isRegister ? "Já tenho conta" : "Criar nova conta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  // ----- FIM DO JSX -----
};

export default LoginPage;