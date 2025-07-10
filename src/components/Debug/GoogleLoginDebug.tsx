import React, { useState } from 'react';

interface GoogleLoginDebugProps {
  onTestLogin: () => Promise<void>;
}

const GoogleLoginDebug: React.FC<GoogleLoginDebugProps> = ({ onTestLogin }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const runDebug = async () => {
    const info: string[] = [];
    
    info.push('=== DEBUG DO LOGIN GOOGLE ===');
    info.push(`URL atual: ${window.location.href}`);
    info.push(`Hostname: ${window.location.hostname}`);
    info.push(`Origin: ${window.location.origin}`);
    info.push(`Protocol: ${window.location.protocol}`);
    info.push(`User Agent: ${navigator.userAgent}`);
    
    // Verificar se estamos no Vercel
    const isVercel = window.location.hostname.includes('vercel.app');
    info.push(`É Vercel: ${isVercel}`);
    
    // Verificar se estamos em desenvolvimento
    const isDev = import.meta.env.DEV;
    info.push(`É desenvolvimento: ${isDev}`);
    
    // Verificar variáveis de ambiente
    const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    info.push(`VITE_SUPABASE_URL configurado: ${hasSupabaseUrl}`);
    info.push(`VITE_SUPABASE_ANON_KEY configurado: ${hasSupabaseKey}`);
    
    // Verificar cookies e localStorage
    const hasAuthCookie = document.cookie.includes('supabase');
    info.push(`Cookie de auth presente: ${hasAuthCookie}`);
    
    const hasLocalStorage = !!localStorage.getItem('supabase.auth.token');
    info.push(`Token no localStorage: ${hasLocalStorage}`);
    
    setDebugInfo(info);
    setShowDebug(true);
  };

  const testGoogleLogin = async () => {
    try {
      setDebugInfo(prev => [...prev, '🔍 Testando login Google...']);
      await onTestLogin();
      setDebugInfo(prev => [...prev, '✅ Login Google iniciado com sucesso']);
    } catch (error) {
      setDebugInfo(prev => [...prev, `❌ Erro no login Google: ${error}`]);
    }
  };

  if (!import.meta.env.DEV) {
    return null; // Só mostrar em desenvolvimento
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={runDebug}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
      >
        🐛 Debug Google
      </button>
      
      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold">Debug Info</h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-xs font-mono bg-gray-100 p-2 rounded">
                {info}
              </div>
            ))}
          </div>
          
          <button
            onClick={testGoogleLogin}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
          >
            Testar Login Google
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginDebug; 