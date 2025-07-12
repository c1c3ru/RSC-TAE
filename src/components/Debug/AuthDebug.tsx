import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

// Declaração de tipos para import.meta.env
declare global {
  interface ImportMeta {
    readonly env: {
      readonly PROD: boolean;
      readonly DEV: boolean;
    };
  }
}

const AuthDebug: React.FC = () => {
  const { currentUser, session, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Só exibe o debug em ambiente de desenvolvimento
  if (import.meta.env.PROD) {
    return null;
  }

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Verificar sessão diretamente do Supabase
        const { data: { session: directSession }, error: sessionError } = await supabase.auth.getSession();
        
        // Verificar usuário diretamente do Supabase
        const { data: { user: directUser }, error: userError } = await supabase.auth.getUser();
        
        // Verificar URL atual
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        
        setDebugInfo({
          contextUser: currentUser,
          contextSession: session,
          contextLoading: loading,
          directSession: directSession,
          directUser: directUser,
          sessionError: sessionError?.message,
          userError: userError?.message,
          currentUrl,
          hasAccessToken: urlParams.has('access_token'),
          hasRefreshToken: urlParams.has('refresh_token'),
          hasError: urlParams.has('error'),
          hasErrorDescription: urlParams.get('error_description'),
        });
        
        // console.log('🔍 Debug - AuthDebug - Estado completo:', {
        //   contextUser: currentUser?.email,
        //   contextSession: session ? 'Ativa' : 'Nenhuma',
        //   contextLoading: loading,
        //   directSession: directSession ? 'Ativa' : 'Nenhuma',
        //   directUser: directUser?.email,
        //   currentUrl,
        //   hasAccessToken: urlParams.has('access_token'),
        //   hasRefreshToken: urlParams.has('refresh_token'),
        //   hasError: urlParams.has('error'),
        // });
        
             } catch (error) {
         console.error('🔍 Debug - Erro ao verificar estado de auth:', error);
         setDebugInfo({ error: error instanceof Error ? error.message : String(error) });
       }
    };

    checkAuthState();
    
    // Verificar a cada 2 segundos
    const interval = setInterval(checkAuthState, 2000);
    
    return () => clearInterval(interval);
  }, [currentUser, session, loading]);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Debug Auth</h3>
      <div className="space-y-1">
        <div><strong>Context User:</strong> {currentUser?.email || 'Nenhum'}</div>
        <div><strong>Context Session:</strong> {session ? 'Ativa' : 'Nenhuma'}</div>
        <div><strong>Context Loading:</strong> {loading ? 'Sim' : 'Não'}</div>
        <div><strong>Direct Session:</strong> {debugInfo.directSession ? 'Ativa' : 'Nenhuma'}</div>
        <div><strong>Direct User:</strong> {debugInfo.directUser?.email || 'Nenhum'}</div>
        <div><strong>URL:</strong> {debugInfo.currentUrl}</div>
        <div><strong>Access Token:</strong> {debugInfo.hasAccessToken ? 'Sim' : 'Não'}</div>
        <div><strong>Refresh Token:</strong> {debugInfo.hasRefreshToken ? 'Sim' : 'Não'}</div>
        <div><strong>Error:</strong> {debugInfo.hasError ? 'Sim' : 'Não'}</div>
        {debugInfo.hasErrorDescription && (
          <div><strong>Error Desc:</strong> {debugInfo.hasErrorDescription}</div>
        )}
        {debugInfo.sessionError && (
          <div><strong>Session Error:</strong> {debugInfo.sessionError}</div>
        )}
        {debugInfo.userError && (
          <div><strong>User Error:</strong> {debugInfo.userError}</div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 