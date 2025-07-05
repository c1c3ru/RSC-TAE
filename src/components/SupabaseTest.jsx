import React, { useState } from 'react';
import supabase from '../utils/supabaseClient';
import ServerStatus from './ServerStatus';
import UrlValidator from './UrlValidator';

const SupabaseTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
      addResult(`📍 Ambiente: ${import.meta.env.PROD ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`, 'info');

    } catch (error) {
      addResult(`❌ Erro geral: ${error.message}`, 'error');
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default SupabaseTest; 