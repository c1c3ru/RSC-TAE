import React, { useState } from 'react';
import supabase from '../utils/supabaseClient';
import ServerStatus from './ServerStatus';
import UrlValidator from './UrlValidator';

const SupabaseTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwt, setJwt] = useState('');
  const [showJwt, setShowJwt] = useState(false);
  const [copied, setCopied] = useState(false);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Teste 1: Verificar conexão com Supabase
      addResult('🔍 Testando conexão com Supabase...', 'info');
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult(`❌ Erro na conexão: ${error.message}`, 'error');
      } else {
        addResult('✅ Conexão com Supabase OK', 'success');
      }

      // Teste 2: Verificar configuração do Google OAuth
      addResult('🔍 Testando configuração do Google OAuth...', 'info');
      
      const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://rsc-tae.vercel.app/dashboard',
          skipBrowserRedirect: true // Não redirecionar, apenas testar
        }
      });

      if (oauthError) {
        addResult(`❌ Erro no Google OAuth: ${oauthError.message}`, 'error');
      } else {
        addResult('✅ Google OAuth configurado corretamente', 'success');
        addResult(`🔗 URL de redirecionamento: ${oauthData?.url}`, 'info');
      }

      // Teste 3: Verificar URLs configuradas
      addResult('🔍 Verificando URLs configuradas...', 'info');
      addResult(`📍 Supabase URL: ${supabase.supabaseUrl}`, 'info');
      addResult(`📍 URL atual: ${window.location.origin}`, 'info');
      // Substituir uso direto de import.meta.env por uma variável segura
      let env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
      addResult(`📍 Ambiente: ${env.PROD ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`, 'info');

    } catch (error) {
      addResult(`❌ Erro geral: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowJwt = async () => {
    const { data } = await supabase.auth.getSession();
    setJwt(data.session?.access_token || '');
    setShowJwt(true);
    setCopied(false);
  };

  const handleCopyJwt = () => {
    if (jwt) {
      navigator.clipboard.writeText(jwt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">🔧 Teste de Configuração do Supabase</h2>
      {/* Status do Servidor */}
      <ServerStatus />
      {/* Validador de URLs */}
      <UrlValidator />
      {/* Testes de Configuração */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">🧪 Testes de Configuração</h3>
        <button
          onClick={runTests}
          disabled={loading}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Executar Testes'}
        </button>
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm ${
                result.type === 'error' ? 'bg-red-100 text-red-800' :
                result.type === 'success' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              <span className="font-mono text-xs">{result.timestamp}</span> {result.message}
            </div>
          ))}
        </div>
        {testResults.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-bold text-yellow-800 mb-2">📋 Instruções:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Se houver erros, configure as URLs no Supabase Dashboard</li>
              <li>• Verifique se o Google OAuth está ativado</li>
              <li>• Confirme se o Client ID e Secret estão corretos</li>
              <li>• Se o erro 500 persistir, pode ser um problema temporário do servidor</li>
              <li>• Use o validador de URLs acima para verificar se há espaços extras</li>
            </ul>
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start space-y-4">
        <h3 className="text-xl font-bold mb-2">🔑 JWT do Usuário Autenticado</h3>
        <button
          onClick={handleShowJwt}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Mostrar JWT do usuário
        </button>
        {showJwt && (
          <div className="w-full">
            {jwt ? (
              <>
                <textarea
                  value={jwt}
                  readOnly
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded font-mono text-xs bg-gray-50 mb-2"
                  style={{resize: 'vertical'}}
                />
                <button
                  onClick={handleCopyJwt}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {copied ? 'Copiado!' : 'Copiar JWT'}
                </button>
              </>
            ) : (
              <div className="text-red-600 font-semibold mt-2">Nenhum JWT encontrado. Faça login para gerar um token.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseTest; 