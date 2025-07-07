import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CARGOS } from '../constants/cargos';
import { LOGIN_TEXTS } from '../constants/texts';
import { useLottie } from 'lottie-react';
import saveAnimation from '../../public/assets/lottie/save_profile_animation.json';
import editAnimation from '../../public/assets/lottie/edit_profile_animation.json';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [message, setMessage] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Registration form fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerMatricula, setRegisterMatricula] = useState('');
  const [registerCargo, setRegisterCargo] = useState('');
  const [registerEscolaridade, setRegisterEscolaridade] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const { login, loginWithGoogle, register, forgotPassword } = useAuth();
  const navigate = useNavigate();
  
  // Configuração das animações
  const { View: SaveAnimationView } = useLottie({
    animationData: saveAnimation,
    loop: false,
    autoplay: false
  });

  const { View: EditAnimationView } = useLottie({
    animationData: editAnimation,
    loop: true,
    autoplay: true
  });
  
  // Animate component on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  const validateEmail = (email) => {
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

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setRegisterEmail(newEmail);
    validateEmail(newEmail);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (forgotPasswordMode) {
      if (!email) {
        setError(LOGIN_TEXTS.recuperarSenhaInstrucao);
        return;
      }
      
      try {
        setLoading(true);
        setShowAnimation(true);
        const result = await forgotPassword(email);
        setMessage(result.message);
      } catch (err) {
        console.error("Password recovery error:", err);
        setError(LOGIN_TEXTS.erroRecuperarSenha);
      } finally {
        setLoading(false);
        setTimeout(() => setShowAnimation(false), 2000);
      }
      return;
    }
    
    if (registerMode) {
      if (!registerName || !registerEmail || !registerPassword || !registerMatricula || !registerCargo || !registerEscolaridade) {
        setError(LOGIN_TEXTS.preenchaTodosCampos);
        return;
      }
      
      // Validar email antes de prosseguir
      if (!validateEmail(registerEmail)) {
        setError(LOGIN_TEXTS.corrijaEmail);
        return;
      }

      try {
        setLoading(true);
        setShowAnimation(true);
        const userInfo = {
          nome: registerName,
          email: registerEmail,
          password: registerPassword,
          matricula: registerMatricula,
          cargo: registerCargo,
          escolaridade: registerEscolaridade
        };
        
        const user = await register(userInfo);
        
        if (user) {
          setMessage(LOGIN_TEXTS.cadastroSucesso);
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
          setError(LOGIN_TEXTS.erroCadastro);
        }
      } catch (err) {
        console.error("Registration error in component:", err);
        // Show more specific error message if available
        setError(err.message || LOGIN_TEXTS.erroCadastro);
      } finally {
        setLoading(false);
        setTimeout(() => setShowAnimation(false), 2000);
      }
      return;
    }
    
    if (!email || !password) {
      setError(LOGIN_TEXTS.preenchaTodosCampos);
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error in component:", err);
      setError(LOGIN_TEXTS.erroLogin);
      setLoading(false);
    }
  };
  
  const toggleForgotPassword = () => {
    setFadeIn(false);
    setTimeout(() => {
      setForgotPasswordMode(!forgotPasswordMode);
      setRegisterMode(false);
      setError('');
      setMessage('');
      setFadeIn(true);
    }, 300);
  };
  
  const toggleRegisterMode = () => {
    setFadeIn(false);
    setTimeout(() => {
      setRegisterMode(!registerMode);
      setForgotPasswordMode(false);
      setError('');
      setMessage('');
      setFadeIn(true);
    }, 300);
  };
  
  // Safe Google login handler separated from button
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(LOGIN_TEXTS.erroLogin);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      {/* Animação de salvamento */}
      {showAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="w-32 h-32 mb-4">
              <SaveAnimationView />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {registerMode ? LOGIN_TEXTS.cadastrando : forgotPasswordMode ? LOGIN_TEXTS.enviandoEmail : LOGIN_TEXTS.processando}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {registerMode ? LOGIN_TEXTS.seuCadastroEstaCriando : forgotPasswordMode ? LOGIN_TEXTS.emailDeRecuperacaoSendoEnviado : LOGIN_TEXTS.aguardeUmMomento}
            </p>
          </div>
        </div>
      )}

      <div 
        className={`max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          
          <div className="flex items-center justify-center relative z-10">
            <div className="w-16 h-16 mr-4">
              <EditAnimationView />
            </div>
            <div>
              <h1 className="text-white text-center text-3xl font-bold">
                {LOGIN_TEXTS.sistemaCalculoPontuacao}
              </h1>
              <p className="text-blue-100 text-center mt-2">
                {LOGIN_TEXTS.progressaoFuncional}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            {forgotPasswordMode ? LOGIN_TEXTS.recuperarSenha : registerMode ? LOGIN_TEXTS.cadastreSe : LOGIN_TEXTS.login}
          </h2>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-pulse" role="alert">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}
          
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="block sm:inline">{message}</span>
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
                    {LOGIN_TEXTS.verifiqueSeuEmailParaContinuar}
                  </h3>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p>• {LOGIN_TEXTS.verifiqueSuaCaixaDeEntradaESpam}</p>
                    <p>• {LOGIN_TEXTS.cliqueNoLinkDeConfirmacaoNoEmail}</p>
                    <p>• {LOGIN_TEXTS.aposAConfirmacaoVocEPoderFazerLogin}</p>
                  </div>
                  <button
                    onClick={() => setShowEmailValidation(false)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {LOGIN_TEXTS.entendiFechar}
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
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>{LOGIN_TEXTS.importante}</strong> {LOGIN_TEXTS.aposCadastroVerifiqueSeuEmailParaContinuar}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-name">
                    {LOGIN_TEXTS.nomeCompleto}
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={LOGIN_TEXTS.joaoSilva}
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-email">
                    {LOGIN_TEXTS.emailInstitucional} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    className={`shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      emailError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={LOGIN_TEXTS.seuEmailInstituicaoEduBr}
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
                    {LOGIN_TEXTS.apenasEmailsComDominioEduSaoAceitosParaValidaçãoInstitucional}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-password">
                    {LOGIN_TEXTS.senha}
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
                      {LOGIN_TEXTS.matricula}
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-cargo">
                      {LOGIN_TEXTS.cargo}
                    </label>
                    <select
                      id="register-cargo"
                      className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={registerCargo}
                      onChange={(e) => setRegisterCargo(e.target.value)}
                    >
                      <option value="">{LOGIN_TEXTS.selecione}</option>
                      {CARGOS.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="register-escolaridade">
                    {LOGIN_TEXTS.escolaridade}
                  </label>
                  <select
                    id="register-escolaridade"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={registerEscolaridade}
                    onChange={(e) => setRegisterEscolaridade(e.target.value)}
                  >
                    <option value="">{LOGIN_TEXTS.selecione}</option>
                    <option value="Ensino fundamental incompleto">{LOGIN_TEXTS.ensinoFundamentalIncompleto}</option>
                    <option value="Ensino fundamental completo">{LOGIN_TEXTS.ensinoFundamentalCompleto}</option>
                    <option value="Ensino médio">{LOGIN_TEXTS.ensinoMedio}</option>
                    <option value="Curso técnico">{LOGIN_TEXTS.cursoTecnico}</option>
                    <option value="Graduação">{LOGIN_TEXTS.graduacao}</option>
                    <option value="Pós-graduação lato sensu (especialização)">{LOGIN_TEXTS.posGraduacaoLatoSensuEspecializacao}</option>
                    <option value="Mestrado">{LOGIN_TEXTS.mestrado}</option>
                    <option value="Doutorado">{LOGIN_TEXTS.doutorado}</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    {LOGIN_TEXTS.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={LOGIN_TEXTS.seuEmailExemploCom}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {!forgotPasswordMode && (
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      {LOGIN_TEXTS.senha}
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
                className={`bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full transform transition-all hover:scale-[1.02] shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading || (registerMode && !!emailError)}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {LOGIN_TEXTS.processando}
                  </span>
                ) : (
                  <span>
                    {forgotPasswordMode ? LOGIN_TEXTS.enviarEmailDeRecuperacao : 
                     registerMode ? LOGIN_TEXTS.criarConta : LOGIN_TEXTS.entrar}
                  </span>
                )}
              </button>
            </div>
            
            {!registerMode && !forgotPasswordMode && (
              <>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-3 text-sm text-gray-500">{LOGIN_TEXTS.ou}</div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-sm mb-4 transform transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                    </g>
                  </svg>
                  {LOGIN_TEXTS.continuarComGoogle}
                </button>
              </>
            )}
            
            <div className="flex justify-center space-x-4 text-sm">
              <button
                type="button"
                onClick={toggleForgotPassword}
                className="text-blue-700 hover:text-blue-800 hover:underline focus:outline-none"
              >
                {forgotPasswordMode ? LOGIN_TEXTS.voltarParaOLogin : LOGIN_TEXTS.esqueceuSuaSenha}
              </button>
              
              <span className="text-gray-400">|</span>
              
              <button
                type="button"
                onClick={toggleRegisterMode}
                className="text-blue-700 hover:text-blue-800 hover:underline focus:outline-none"
              >
                {registerMode ? LOGIN_TEXTS.jáTenhoUmaConta : LOGIN_TEXTS.criarNovaConta}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-600 text-xs">
            <p>{LOGIN_TEXTS.copyright2025SistemaDeCalculoDePontuacaoParaProgressãoFuncional}</p>
            <p className="mt-1">{LOGIN_TEXTS.versão10Teste}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;