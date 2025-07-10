import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [error, setError] = useState(null);

  const checkServerStatus = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      // Teste 1: Conexão básica e saúde da API de autenticação.
      // O endpoint /health é leve e feito para isso.
      const response = await fetch(`${supabase.supabaseUrl}/auth/v1/health`, {
        method: 'GET',
        headers: {
          'apikey': supabase.supabaseKey,
        }
      });

      if (!response.ok) {
        // Se a resposta não for OK, o servidor está com problemas.
        throw new Error(`Servidor de autenticação retornou status ${response.status}`);
      }
      if (dbError) {
        console.log('[DB ERROR]', dbError);
        if (dbError.message !== 'JWT expired') {
          throw new Error(`Erro na API de dados: ${dbError.message}`);
        }
      }
      
      const healthData = await response.json();
      if (healthData.status !== 'ok' && healthData.description !== 'database is healthy') {
         throw new Error(`API retornou status não saudável: ${healthData.description}`);
      }

      // Teste 2: Conexão com a API do banco de dados (PostgREST)
      // Fazemos uma consulta leve para garantir que a API de dados está funcionando.
      const { error: dbError } = await supabase
        .from('user_profile') // Use uma de suas tabelas
        .select('id')
        .limit(1);

      // Ignoramos erros de JWT inválido, pois não indicam que o servidor está fora.
      if (dbError && dbError.message !== 'JWT expired') {
        throw new Error(`Erro na API de dados: ${dbError.message}`);
      }

      // Se todos os testes passaram, o servidor está saudável.
      setStatus('healthy');
      
    } catch (err) {
      setStatus('error');
      setError(err.message);
    } finally {
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
            {status === 'error' && 'Erro de Conexão'}
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
          Última verificação: {lastCheck.toLocaleTimeString('pt-BR')}
        </p>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-1">Detalhe do Erro:</h4>
          <p className="text-sm text-red-700 break-words">{error}</p>
        </div>
      )}

      {status === 'healthy' && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            Conexão com a API e o banco de dados estabelecida com sucesso.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerStatus;