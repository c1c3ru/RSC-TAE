import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ERROR_MESSAGES } from '../constants/texts';
import Lottie from 'lottie-react';
import saveProfileAnimation from '../assets/lottie/save_profile_animation.json';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
      if (error) throw error;
      setSuccess('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setEmail('');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.erroDesconhecido);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div 
        className={`max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
          
          <div className="flex items-center justify-center relative z-10">
            <div className="w-16 h-16 mr-4">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-center text-2xl font-bold">
                Recuperar Senha
              </h1>
              <p className="text-blue-100 text-center mt-2">
                Digite seu email para receber o link de recuperação
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
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
                    Erro ao enviar email
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 animate-pulse" role="alert">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8">
                    <Lottie animationData={saveProfileAnimation} style={{ width: 32, height: 32 }} />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Email enviado com sucesso!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{success}</p>
                    <p className="mt-2 text-xs">Você será redirecionado em alguns segundos...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Institucional
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="exemplo@ifce.edu.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    loading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  required
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
              <p className="text-xs text-gray-500 mt-1">
                Digite o email cadastrado no sistema para receber o link de recuperação
              </p>
            </div>
            
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
                  Enviando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar link de recuperação
                </>
              )}
            </button>
        </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all"
              disabled={loading}
            >
              ← Voltar para Login
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600 text-xs">
            <p>© 2025 Sistema de Cálculo de Pontuação para Progressão Funcional</p>
            <p className="mt-1">Versão 1.0 - Teste</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 