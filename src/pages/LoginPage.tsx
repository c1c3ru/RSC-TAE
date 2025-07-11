
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CARGOS_TAE } from '../constants/cargos';
import { LOGIN_TEXTS } from '../constants/texts';
import GoogleLoginDebug from '../components/Debug/GoogleLoginDebug';
import AuthDebug from '../components/Debug/AuthDebug';
// import { useLottie } from 'lottie-react';
// Remover as importações de animações de perfil
// import saveAnimation from '../assets/lottie/save_profile_animation.json';
// import editAnimation from '../assets/lottie/edit_profile_animation.json';
// Se houver uma animação genérica de login, importe aqui, exemplo:
// import loginAnimation from '../assets/lottie/login_animation.json';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [message, setMessage] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);
  
  // Registration form fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerMatricula, setRegisterMatricula] = useState('');
  const [registerCargo, setRegisterCargo] = useState('');
  const [registerEscolaridade, setRegisterEscolaridade] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Novo estado para loading do Google
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { login, loginWithGoogle, register, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  
  // Remover configuração das animações de perfil
  // const { View: SaveAnimationView } = useLottie({
  //   animationData: saveAnimation,
  //   loop: false,
  //   autoplay: false
  // });
  // const { View: EditAnimationView } = useLottie({
  //   animationData: editAnimation,
  //   loop: true,
  //   autoplay: true
  // });

  // Remover funções renderSaveAnimation e renderEditAnimation
  // Garantir que View é um elemento React
  // const renderSaveAnimation = () => {
  //   return saveAnimation && typeof saveAnimation === 'object' && React.isValidElement(SaveAnimationView) ? SaveAnimationView : null;
  // };
  // const renderEditAnimation = () => {
  //   return editAnimation && typeof editAnimation === 'object' && React.isValidElement(EditAnimationView) ? EditAnimationView : null;
  // };
  
  // Animate component on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('');
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(LOGIN_TEXTS.emailInvalido);
      return false;
    }

    // Verificar se é um domínio .edu
    const domain = email.split('@')[1];
    if (!domain || !domain.includes('.edu')) {
      setEmailError(LOGIN_TEXTS.emailNaoEdu);
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setRegisterEmail(newEmail);
    validateEmail(newEmail);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (registerMode) {
      // Validação obrigatória dos campos
      if (!registerName || !registerEmail || !registerPassword || !registerMatricula || !registerCargo || !registerEscolaridade) {
        console.error('[REGISTER] Falha na validação: campos obrigatórios não preenchidos', {
          registerName, registerEmail, registerPassword, registerMatricula, registerCargo, registerEscolaridade
        });
        setError('Preencha todos os campos obrigatórios');
        return;
      }
      // Validar email antes de prosseguir
      if (!validateEmail(registerEmail)) {
        setError('Corrija o email informado');
        return;
      }
      try {
        setLoading(true);
        setShowAnimation(true);
        const user = await register(
          registerEmail,
          registerPassword,
          {
            nome: registerName,
            email: registerEmail,
            matricula: registerMatricula,
            cargo: registerCargo,
            escolaridade: registerEscolaridade
          }
        );
        if (user != null) {
          setMessage('Cadastro realizado com sucesso!');
          setShowEmailValidation(true);
          setRegisterMode(false);
          setEmail(registerEmail);
          // Reset registration fields
          setRegisterName('');
          setRegisterEmail('');
          setRegisterPassword('');
          setRegisterMatricula('');
          setRegisterCargo('');
          setRegisterEscolaridade('');
          setEmailError('');
        } else {
          setError('Erro ao cadastrar usuário');
        }
      } catch (err) {
        console.error('[REGISTER] Registration error in component:', err);
        setError(
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'Erro ao cadastrar usuário'
        );
      } finally {
        setTimeout(() => {
          setShowAnimation(false);
          setLoading(false);
        }, 1000); // Garante pelo menos 1s de spinner
      }
      return;
    }
    
    if (email === '' || password === '') {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      
      // Se o erro for de email não confirmado, mostrar opção de reenvio
      if (errorMessage.includes('Email não confirmado')) {
        setShowResendEmail(true);
      }
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await resendConfirmationEmail(email);
      setMessage('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      setShowResendEmail(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reenviar email';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleRegisterMode = () => {
    setFadeIn(false);
    setTimeout(() => {
      setRegisterMode(!registerMode);
      setError('');
      setMessage('');
      setFadeIn(true);
    }, 300);
  };
  
  // Safe Google login handler separada do botão
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setLoading(true);
      setError('');
      setMessage('');
      
      console.log('🔍 Debug - Iniciando processo de login Google');
      
      // Garante pelo menos 1 segundo de spinner
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
      await Promise.all([loginWithGoogle(), minDelay]);
      
      console.log('🔍 Debug - Login Google concluído com sucesso');
      // O redirecionamento será feito automaticamente pelo Supabase
      
    } catch (error) {
      console.error('🔍 Debug - Erro no login Google:', error);
      
      let errorMessage = 'Erro ao fazer login com Google';
      
      if (error instanceof Error) {
        if (error.message.includes('URL de redirecionamento inválida')) {
          errorMessage = 'Configuração incorreta. Entre em contato com o administrador.';
        } else if (error.message.includes('Google OAuth não está configurado')) {
          errorMessage = 'Login com Google temporariamente indisponível. Tente novamente mais tarde.';
        } else if (error.message.includes('Client ID do Google não encontrado')) {
          errorMessage = 'Configuração do Google incompleta. Tente novamente mais tarde.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
      setGoogleLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      {/* Animação de salvamento */}
      {(showAnimation || googleLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            {googleLoading ? (
              <>
                <div className="flex flex-col items-center mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Redirecionando para o Google...</h3>
                  <p className="text-sm text-gray-600 text-center">Aguarde, você será direcionado para a autenticação do Google.</p>
                </div>
              </>
            ) : (
              <>
                {/* Remover o uso de {renderSaveAnimation()} e {renderEditAnimation()} */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {registerMode
                    ? 'Cadastrando...'
                    : 'Processando...'}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {registerMode
                    ? 'Seu cadastro está sendo criado...'
                    : 'Aguarde um momento...'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div 
        className={`max-w-sm sm:max-w-md md:max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 sm:p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center relative z-10">
            <div className="w-16 h-16 mb-4 sm:mb-0 sm:mr-4">
              {/* Se houver uma animação de login, pode adicionar aqui:
              <Lottie animationData={loginAnimation} style={{ width: 64, height: 64 }} />
              */}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                Sistema de Cálculo de Pontuação
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-2">
                Progressão Funcional
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {registerMode ? 'Cadastre-se' : 'Entrar'}
          </h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-bounce" role="alert">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Erro de Autenticação
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 animate-pulse" role="alert">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Sucesso!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {showEmailValidation && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6 animate-pulse" role="alert">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    Verifique seu email para continuar
                  </h3>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p>• Verifique sua caixa de entrada e spam</p>
                    <p>• Clique no link de confirmação no email</p>
                    <p>• Após a confirmação, você poderá fazer login</p>
                  </div>
                  <button
                    onClick={() => setShowEmailValidation(false)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Entendi, fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResendEmail && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Email não confirmado:</strong> Não foi possível autenticar seu email.
                    <br />
                    Por favor, verifique sua caixa de entrada e clique no link de confirmação.
                    <br />
                    Se não recebeu o email, clique em "Reenviar email de confirmação".
                  </p>
                  <button
                    onClick={handleResendEmail}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                    disabled={loading}
                  >
                    {loading ? "Reenviando..." : "Reenviar email de confirmação"}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={`transition-all duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {registerMode ? (
              <>
                {/* Aviso sobre validação de email */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Importante:</strong> Após o cadastro, verifique seu email para continuar.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-name">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-email">
                    Email Institucional <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      emailError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="exemplo@ifce.edu.br"
                    value={registerEmail}
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <div className="text-red-600 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {LOGIN_TEXTS.apenasEmailsComDominioEduSaoAceitosParaValidacaoInstitucional}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-password">
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-matricula">
                      Matrícula
                    </label>
                    <input
                      id="register-matricula"
                      type="text"
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="IFCE12345"
                      value={registerMatricula}
                      onChange={(e) => setRegisterMatricula(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-cargo">
                      Cargo
                    </label>
                    <select
                      id="register-cargo"
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={registerCargo}
                      onChange={(e) => setRegisterCargo(e.target.value)}
                    >
                      <option value="">Selecione o cargo</option>
                      {CARGOS_TAE.map(cargo => (
                        <option key={cargo.codigo} value={cargo.nome}>{cargo.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-escolaridade">
                    Escolaridade
                  </label>
                  <select
                    id="register-escolaridade"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={registerEscolaridade}
                    onChange={(e) => setRegisterEscolaridade(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="Ensino fundamental incompleto">Ensino fundamental incompleto</option>
                    <option value="Ensino fundamental completo">Ensino fundamental completo</option>
                    <option value="Ensino médio">Ensino médio</option>
                    <option value="Curso técnico">Curso técnico</option>
                    <option value="Graduação">Graduação</option>
                    <option value="Pós-graduação lato sensu (especialização)">Pós-graduação lato sensu (especialização)</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        loading ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="exemplo@ifce.edu.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    {loading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        loading ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    {loading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {!registerMode && (
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => navigate('/reset-password')}
                        className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all"
                        disabled={loading}
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                } text-white flex items-center justify-center`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {registerMode ? "Cadastrando..." : "Entrando..."}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {registerMode ? "Cadastrar" : "Entrar"}
                  </>
                )}
              </button>
            </div>
            
            <div className="flex justify-center space-x-4 text-sm">
              <button
                type="button"
                onClick={toggleRegisterMode}
                className="text-blue-700 hover:text-blue-800 hover:underline focus:outline-none"
              >
                {registerMode ? 'Já tenho uma conta' : 'Criar nova conta'}
              </button>
            </div>
          </form>

          {/* Botão Google fora do form para evitar submit/refresh */}
          {!registerMode && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-3 text-sm text-gray-500">ou</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`w-full flex items-center justify-center font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-sm mb-4 transform transition-all duration-200 ${
                  loading || googleLoading
                    ? 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02]'
                }`}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                      </g>
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>
            </>
          )}
          
          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600 text-xs">
            <p>© 2025 Sistema de Cálculo de Pontuação para Progressão Funcional</p>
            <p className="mt-1">Versão 1.0 - Teste</p>
          </div>
        </div>
      </div>
      
      {/* Componente de debug apenas em desenvolvimento */}
      <GoogleLoginDebug onTestLogin={handleGoogleLogin} />
      {/* Componente de debug temporário */}
      <AuthDebug />
    </div>
  );
};

export default LoginPage;
