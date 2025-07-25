
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CARGOS_TAE, CATEGORIAS_CARGO } from '../constants/cargos';
import { LOGIN_TEXTS } from '../constants/texts';
import { sanitizeEmail, RateLimiter } from '../utils/security';
// Lottie imports
import { useLottie } from 'lottie-react';
import saveProfileAnimation from '../assets/lottie/save_profile_animation.json';
import dashboardAnimation from '../assets/lottie/dashboard_animation.json';
import loginPageAnimation from '../assets/lottie/login_page_animation.json';
import loginGoogleAnimation from '../assets/lottie/login_google_animation.json';
// import activitiesRegistrationAnimation from '../assets/lottie/activities_registration_animation.json';
// import notFoundAnimation from '../assets/lottie/404_not_found_animation.json';
import ifceLogo from '../assets/images/ifce.png';

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
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerMatricula, setRegisterMatricula] = useState('');
  const [registerCargo, setRegisterCargo] = useState('');
  const [registerCategoriaFuncional, setRegisterCategoriaFuncional] = useState('');
  const [registerEscolaridade, setRegisterEscolaridade] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [matriculaError, setMatriculaError] = useState('');
  const [cargoError, setCargoError] = useState('');
  const [categoriaError, setCategoriaError] = useState('');
  
  // Novo estado para loading do Google
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { login, loginWithGoogle, register, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  
  // Rate limiter para tentativas de login
  const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 tentativas em 15 minutos
  
  // Lottie imports
  const { View: SaveProfileLottie } = useLottie({
    animationData: saveProfileAnimation,
    loop: true,
    autoplay: true,
    style: { width: 80, height: 80 }
  });
  const { View: DashboardLottie } = useLottie({
    animationData: dashboardAnimation,
    loop: true,
    autoplay: true,
    style: { width: 80, height: 80 }
  });
  const { View: LoginPageLottie } = useLottie({
    animationData: loginPageAnimation,
    loop: true,
    autoplay: true,
    style: { width: 120, height: 120 }
  });
  const { View: LoginGoogleLottie } = useLottie({
    animationData: loginGoogleAnimation,
    loop: true,
    autoplay: true,
    style: { width: 44, height: 44 }
  });
  // const { View: ActivitiesRegistrationLottie } = useLottie({
  //   animationData: activitiesRegistrationAnimation,
  //   loop: true,
  //   autoplay: true,
  //   style: { width: 80, height: 80 }
  // });
  // const { View: NotFoundLottie } = useLottie({
  //   animationData: notFoundAnimation,
  //   loop: true,
  //   autoplay: true,
  //   style: { width: 80, height: 80 }
  // });
  
  // Animate component on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('');
      return true;
    }

    try {
      // Sanitiza e valida o email
      const sanitizedEmail = sanitizeEmail(email);
      
      // Verificar se é um domínio .edu
      const domain = sanitizedEmail.split('@')[1];
      if (!domain || !domain.includes('.edu')) {
        setEmailError(LOGIN_TEXTS.emailNaoEdu);
        return false;
      }

      setEmailError('');
      return true;
    } catch {
      setEmailError(LOGIN_TEXTS.emailInvalido);
      return false;
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('');
      return true;
    }

    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (password.length > 50) {
      setPasswordError('A senha deve ter no máximo 50 caracteres');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('');
      return true;
    }

    if (confirmPassword !== registerPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      return false;
    }

    setConfirmPasswordError('');
    return true;
  };

  const validateMatricula = (matricula: string) => {
    if (!matricula) {
      setMatriculaError('');
      return true;
    }

    if (matricula.length < 3) {
      setMatriculaError('A matrícula deve ter pelo menos 3 caracteres');
      return false;
    }

    if (matricula.length > 20) {
      setMatriculaError('A matrícula deve ter no máximo 20 caracteres');
      return false;
    }

    setMatriculaError('');
    return true;
  };

  const validateCargo = (cargo: string) => {
    if (!cargo) {
      setCargoError('');
      return true;
    }

    setCargoError('');
    return true;
  };

  const validateCategoria = (categoria: string) => {
    if (!categoria) {
      setCategoriaError('');
      return true;
    }

    setCategoriaError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setRegisterEmail(newEmail);
    validateEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setRegisterPassword(newPassword);
    validatePassword(newPassword);
    // Revalidar confirmação quando a senha muda
    if (registerConfirmPassword) {
      validateConfirmPassword(registerConfirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setRegisterConfirmPassword(newConfirmPassword);
    validateConfirmPassword(newConfirmPassword);
  };

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMatricula = e.target.value;
    setRegisterMatricula(newMatricula);
    validateMatricula(newMatricula);
  };

  const handleCargoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCargo = e.target.value;
    setRegisterCargo(newCargo);
    validateCargo(newCargo);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoria = e.target.value;
    setRegisterCategoriaFuncional(newCategoria);
    validateCategoria(newCategoria);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (registerMode) {
      // Validação obrigatória dos campos
      if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword || 
          !registerMatricula || !registerCargo || !registerCategoriaFuncional || !registerEscolaridade) {
        console.error('[REGISTER] Falha na validação: campos obrigatórios não preenchidos', {
          registerName, registerEmail, registerPassword, registerConfirmPassword, 
          registerMatricula, registerCargo, registerCategoriaFuncional, registerEscolaridade
        });
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      // Validar todos os campos antes de prosseguir
      const isEmailValid = validateEmail(registerEmail);
      const isPasswordValid = validatePassword(registerPassword);
      const isConfirmPasswordValid = validateConfirmPassword(registerConfirmPassword);
      const isMatriculaValid = validateMatricula(registerMatricula);
      const isCargoValid = validateCargo(registerCargo);
      const isCategoriaValid = validateCategoria(registerCategoriaFuncional);

      if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || 
          !isMatriculaValid || !isCargoValid || !isCategoriaValid) {
        setError('Corrija os erros nos campos antes de continuar');
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
            categoria_funcional: registerCategoriaFuncional,
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
          setRegisterConfirmPassword('');
          setRegisterMatricula('');
          setRegisterCargo('');
          setRegisterCategoriaFuncional('');
          setRegisterEscolaridade('');
          setEmailError('');
          setPasswordError('');
          setConfirmPasswordError('');
          setMatriculaError('');
          setCargoError('');
          setCategoriaError('');
        } else {
          setError('Erro ao cadastrar usuário');
        }
      } catch (err) {
        console.error('[REGISTER] Registration error in component:', err);
        
        let errorMessage = 'Erro ao cadastrar usuário';
        
        if (err instanceof Error) {
          if (err.message.includes('User already registered')) {
            errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
          } else if (err.message.includes('Password should be at least')) {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
          } else if (err.message.includes('Unable to validate email address')) {
            errorMessage = 'Email inválido. Verifique se o formato está correto.';
          } else if (err.message.includes('Signup not allowed')) {
            errorMessage = 'Cadastro não permitido. Entre em contato com o administrador.';
          } else if (err.message.includes('Email not confirmed')) {
            errorMessage = 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      } finally {
        setTimeout(() => {
          setShowAnimation(false);
          setLoading(false);
        }, 1000); // Garante pelo menos 1s de spinner
      }
      return;
    }
    
    // Rate limiting para tentativas de login
    const clientKey = `${email}-${navigator.userAgent}`;
    if (!rateLimiter.isAllowed(clientKey)) {
      setError('Muitas tentativas de login. Tente novamente em 15 minutos.');
      return;
    }
    
    if (email === '' || password === '') {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setLoading(true);
      setError(''); // Limpar erros anteriores
      setMessage(''); // Limpar mensagens anteriores
      
      // Sanitizar dados antes do login
      const sanitizedEmail = sanitizeEmail(email);
      
      await login(sanitizedEmail, password);
      
      // Se chegou aqui, o login foi bem-sucedido
      setMessage('Login realizado com sucesso! Redirecionando...');
      setTimeout(() => {
      navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      
      // Se o erro for de email não confirmado, mostrar opção de reenvio
      if (errorMessage.includes('Email não confirmado') || errorMessage.includes('Email not confirmed')) {
        setShowResendEmail(true);
        setShowEmailValidation(true); // Mostrar instruções de verificação
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
      
      // console.log('🔍 Debug - Iniciando processo de login Google');
      
      // Garante pelo menos 1 segundo de spinner
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
      await Promise.all([loginWithGoogle(), minDelay]);
      
      // console.log('🔍 Debug - Login Google concluído com sucesso');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 min-w-0">
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
                <div className="flex flex-col items-center mb-4">
                  {/* Animação Lottie de acordo com o contexto */}
                  {registerMode ? SaveProfileLottie : DashboardLottie}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {registerMode ? 'Cadastrando...' : 'Processando...'}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {registerMode ? 'Seu cadastro está sendo criado...' : 'Aguarde um momento...'}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div 
        className={`max-w-sm sm:max-w-md md:max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} min-w-0`}
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
          
          {/* Animação de Login */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              {LoginPageLottie}
            </div>
          </div>

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
                    placeholder="exemplo@sua.instituição.edu.br"
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
                  <div className="relative">
                  <input
                    id="register-password"
                      type={showPassword ? "text" : "password"}
                      className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        passwordError ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="********"
                    value={registerPassword}
                      onChange={handlePasswordChange}
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={showPassword
                            ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 5.25 7.5 9 9 9s9-3.75 9-9-7.5-9-9-9-9 3.75-9 9z"
                            : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 011.563-2.037M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.543-5.037A10.025 10.025 0 0121 12c0 2.042-.613 3.94-1.668 5.537M9.88 9.88a3 3 0 104.24 4.24"}
                        />
                      </svg>
                    </span>
                  </div>
                  {passwordError && (
                    <div className="text-red-600 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {passwordError}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-confirm-password">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="********"
                      value={registerConfirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={showConfirmPassword
                            ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 5.25 7.5 9 9 9s9-3.75 9-9-7.5-9-9-9-9 3.75-9 9z"
                            : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 011.563-2.037M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.543-5.037A10.025 10.025 0 0121 12c0 2.042-.613 3.94-1.668 5.537M9.88 9.88a3 3 0 104.24 4.24"}
                        />
                      </svg>
                    </span>
                  </div>
                  {confirmPasswordError && (
                    <div className="text-red-600 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-matricula">
                      Matrícula
                    </label>
                    <input
                      id="register-matricula"
                      type="text"
                      className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        matriculaError ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Matrícula"
                      value={registerMatricula}
                      onChange={handleMatriculaChange}
                    />
                    {matriculaError && (
                      <div className="text-red-600 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {matriculaError}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-cargo">
                      Cargo
                    </label>
                    <select
                      id="register-cargo"
                      className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        cargoError ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={registerCargo}
                      onChange={handleCargoChange}
                    >
                      <option value="">Selecione o cargo</option>
                      {CARGOS_TAE.map(cargo => (
                        <option key={cargo.codigo} value={cargo.nome}>{cargo.nome}</option>
                      ))}
                    </select>
                    {cargoError && (
                      <div className="text-red-600 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {cargoError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-categoria-funcional">
                    Categoria Funcional
                  </label>
                  <select
                    id="register-categoria-funcional"
                    className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      categoriaError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={registerCategoriaFuncional}
                    onChange={handleCategoriaChange}
                  >
                    <option value="">Selecione a categoria funcional</option>
                    {CATEGORIAS_CARGO.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                  {categoriaError && (
                    <div className="text-red-600 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {categoriaError}
                    </div>
                  )}
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
                    placeholder="exemplo@sua.instituição.edu.br"
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
                    type={showLoginPassword ? "text" : "password"}
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
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={showLoginPassword
                            ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 5.25 7.5 9 9 9s9-3.75 9-9-7.5-9-9-9-9 3.75-9 9z"
                            : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 011.563-2.037M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.543-5.037A10.025 10.025 0 0121 12c0 2.042-.613 3.94-1.668 5.537M9.88 9.88a3 3 0 104.24 4.24"}
                        />
                      </svg>
                    </span>
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
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p className="text-sm text-gray-600">Conectando com Google...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 mr-2">
                      {LoginGoogleLottie}
                    </div>
                    Conectar com Google
                  </>
                )}
              </button>

              {/* Bloco de autoria e logo IFCE dentro do card */}
              <div className="flex flex-col items-center justify-center mt-4 mb-2">
                <span className="text-xs text-gray-500 text-center mb-2">
                  Desenvolvido por <strong>c1c3ru</strong> — contato: <a href="mailto:cicero.silva@ifce.edu.br" className="underline hover:text-blue-700">cicero.silva@ifce.edu.br</a>
                </span>
                <img src={ifceLogo} alt="Logo IFCE" style={{ width: 36, height: 36, maxWidth: '20vw' }} className="mb-1" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;