import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [message, setMessage] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  // Registration form fields
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMatricula, setRegisterMatricula] = useState("");
  const [registerCargo, setRegisterCargo] = useState("");

  const { login, loginWithGoogle, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  // Animate component on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (forgotPasswordMode) {
      if (!email) {
        setError("Digite seu e-mail para recuperar a senha.");
        return;
      }

      try {
        setLoading(true);
        const result = await forgotPassword(email);
        setMessage(result.message);
        setLoading(false);
      } catch (err) {
        setError("Erro ao processar a solicitação. Tente novamente.");
        setLoading(false);
        console.error("Forgot password error:", err);
      }
      return;
    }

    if (registerMode) {
      if (
        !registerName ||
        !registerEmail ||
        !registerPassword ||
        !registerMatricula ||
        !registerCargo
      ) {
        setError("Preencha todos os campos para realizar o cadastro.");
        return;
      }

      try {
        setLoading(true);

        // Create user info object with all required fields
        const userInfo = {
          nome: registerName,
          email: registerEmail,
          password: registerPassword,
          matricula: registerMatricula,
          cargo: registerCargo,
        };

        // Call register function with proper error handling
        const user = await register(userInfo);

        if (user) {
          setMessage(
            "Cadastro realizado com sucesso! Faça login para continuar."
          );
          setRegisterMode(false);
          setEmail(registerEmail);
        } else {
          setError("Não foi possível completar o cadastro. Tente novamente.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Registration error details:", err);
        setError(
          err.message ||
            "Erro ao realizar cadastro. Por favor, tente novamente."
        );
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error details:", err);
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setFadeIn(false);
    setTimeout(() => {
      setForgotPasswordMode(!forgotPasswordMode);
      setRegisterMode(false);
      setError("");
      setMessage("");
      setFadeIn(true);
    }, 300);
  };

  const toggleRegisterMode = () => {
    setFadeIn(false);
    setTimeout(() => {
      setRegisterMode(!registerMode);
      setForgotPasswordMode(false);
      setError("");
      setMessage("");
      setFadeIn(true);
    }, 300);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
      // No need to navigate, redirect is handled by Supabase
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        "Erro ao realizar login com Google. Por favor, tente novamente."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div
        className={`max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          fadeIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>

          <h1 className="text-white text-center text-3xl font-bold relative z-10">
            Sistema de Cálculo de Pontuação
          </h1>
          <p className="text-blue-100 text-center mt-2 relative z-10">
            Progressão Funcional
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {forgotPasswordMode
              ? "Recuperar Senha"
              : registerMode
              ? "Cadastre-se"
              : "Login"}
          </h2>

          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-pulse"
              role="alert"
            >
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}

          {message && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
              role="alert"
            >
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="block sm:inline">{message}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`transition-all duration-500 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {registerMode ? (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="register-name"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="João Silva"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="register-email"
                  >
                    E-mail
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="seu.email@exemplo.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="register-password"
                  >
                    Senha
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="********"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="register-matricula"
                    >
                      Matrícula
                    </label>
                    <input
                      id="register-matricula"
                      type="text"
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="MAT12345"
                      value={registerMatricula}
                      onChange={(e) => setRegisterMatricula(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="register-cargo"
                    >
                      Cargo
                    </label>
                    <select
                      id="register-cargo"
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={registerCargo}
                      onChange={(e) => setRegisterCargo(e.target.value)}
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Analista de Tecnologia da Informação">
                        Analista de Tecnologia da Informação
                      </option>
                      <option value="Assistente de Alunos">
                        Assistente de Alunos
                      </option>
                      <option value="Assistente em Administração">
                        Assistente em Administração
                      </option>
                      <option value="Assistente Social">
                        Assistente Social
                      </option>
                      <option value="Auditor">Auditor</option>
                      <option value="Bibliotecário-Documentalista">
                        Bibliotecário-Documentalista
                      </option>
                      <option value="Contador">Contador</option>
                      <option value="Enfermeiro">Enfermeiro</option>
                      <option value="Fisioterapeuta">Fisioterapeuta</option>
                      <option value="Médico">Médico</option>
                      <option value="Nutricionista">Nutricionista</option>
                      <option value="Pedagogo">Pedagogo</option>
                      <option value="Técnico em Administração">
                        Técnico em Administração
                      </option>
                      <option value="Técnico em Assuntos Educacionais">
                        Técnico em Assuntos Educacionais
                      </option>
                      <option value="Técnico em Contabilidade">
                        Técnico em Contabilidade
                      </option>
                      <option value="Técnico em Enfermagem">
                        Técnico em Enfermagem
                      </option>
                      <option value="Técnico de Laboratório">
                        Técnico de Laboratório
                      </option>
                      <option value="Técnico em Tecnologia da Informação">
                        Técnico em Tecnologia da Informação
                      </option>
                      <option value="Outro">Outro/Cargos extintos</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {!forgotPasswordMode && (
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between mb-4">
              <button
                type="submit"
                className={`bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full transform transition-all hover:scale-[1.02] shadow-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <span>
                    {forgotPasswordMode
                      ? "Enviar E-mail de Recuperação"
                      : registerMode
                      ? "Criar Conta"
                      : "Entrar"}
                  </span>
                )}
              </button>
            </div>

            {!registerMode && !forgotPasswordMode && (
              <>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-3 text-sm text-gray-500">ou</div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-sm mb-4 transform transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Continuar com Google
                </button>
              </>
            )}

            <div className="flex justify-center space-x-4 text-sm">
              <button
                type="button"
                onClick={toggleForgotPassword}
                className="text-blue-700 hover:text-blue-800 hover:underline focus:outline-none"
              >
                {forgotPasswordMode
                  ? "Voltar para o Login"
                  : "Esqueceu sua senha?"}
              </button>

              <span className="text-gray-400">|</span>

              <button
                type="button"
                onClick={toggleRegisterMode}
                className="text-blue-700 hover:text-blue-800 hover:underline focus:outline-none"
              >
                {registerMode ? "Já tenho uma conta" : "Criar nova conta"}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600 text-xs">
            <p>
              © 2025 Sistema de Cálculo de Pontuação para Progressão Funcional
            </p>
            <p className="mt-1">Versão 1.0 Teste</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
