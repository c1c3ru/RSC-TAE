import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [error, setError] = useState(null);

  const checkServerStatus = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      // Teste 1: Conexão básica
      const { data, error: connectionError } = await supabase.auth.getSession();
      
      if (connectionError) {
        throw new Error(`Erro de conexão: ${connectionError.message}`);
      }

      // Teste 2: Verificar se o servidor está respondendo
      const response = await fetch(`${supabase.supabaseUrl}/auth/v1/health`, {
        method: 'GET',
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}`);
      }

      // Teste 3: Verificar configuração do Google OAuth
      const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://rsc-tae.vercel.app/dashboard',
          skipBrowserRedirect: true
        }
      });

      if (oauthError) {
        throw new Error(`Erro OAuth: ${oauthError.message}`);
      }

      setStatus('healthy');
      setLastCheck(new Date());
      
    } catch (err) {
      setStatus('error');
      setError(err.message);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkServerStatus();
    
    // Verificar a cada 5 minutos
    const interval = setInterval(checkServerStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'checking': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy': return '✅';
      case 'error': return '❌';
      case 'checking': return '🔄';
      default: return '❓';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">🖥️ Status do Servidor Supabase</h3>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getStatusIcon()}</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor()}`}>
            {status === 'healthy' && 'Servidor OK'}
            {status === 'error' && 'Erro no Servidor'}
            {status === 'checking' && 'Verificando...'}
          </span>
        </div>
        
        <button
          onClick={checkServerStatus}
          disabled={status === 'checking'}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Verificar
        </button>
      </div>

      {lastCheck && (
        <p className="text-xs text-gray-500 mb-2">
          Última verificação: {lastCheck.toLocaleTimeString()}
        </p>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-1">Erro Detectado:</h4>
          <p className="text-sm text-red-700">{error}</p>
          
          <div className="mt-2 text-xs text-red-600">
            <p><strong>Soluções sugeridas:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Verificar logs do Supabase Dashboard</li>
              <li>Reconfigurar Google OAuth</li>
              <li>Aguardar alguns minutos e tentar novamente</li>
              <li>Contatar suporte do Supabase se persistir</li>
            </ul>
          </div>
        </div>
      )}

      {status === 'healthy' && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            ✅ Servidor funcionando normalmente. O erro 500 pode ser temporário.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerStatus; 