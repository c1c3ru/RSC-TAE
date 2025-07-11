import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const AuthDebug: React.FC = () => {
  const { currentUser, session, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const runDebug = async () => {
    let info = '=== DEBUG DE AUTENTICAÇÃO ===\n\n';
    
    // Informações básicas
    // @ts-expect-error: import.meta.env é suportado pelo Vite
    info += `URL do Supabase: ${import.meta.env.VITE_SUPABASE_URL}\n`;
    // @ts-expect-error: import.meta.env é suportado pelo Vite
    info += `Chave Anônima configurada: ${!!import.meta.env.VITE_SUPABASE_ANON_KEY}\n`;
    info += `URL atual: ${window.location.href}\n`;
    info += `Origin: ${window.location.origin}\n\n`;
    
    // Status da sessão
    info += `Status do usuário: ${currentUser ? 'Logado' : 'Não logado'}\n`;
    info += `Loading: ${loading}\n`;
    info += `Sessão ativa: ${!!session}\n\n`;
    
    if (currentUser) {
      info += `ID do usuário: ${currentUser.id}\n`;
      info += `Email: ${currentUser.email}\n`;
      info += `Email confirmado: ${currentUser.email_confirmed_at ? 'Sim' : 'Não'}\n`;
      info += `Criado em: ${currentUser.created_at}\n`;
      info += `Último login: ${currentUser.last_sign_in_at}\n\n`;
    }
    
    // Testar conexão com Supabase
    try {
      info += 'Testando conexão com Supabase...\n';
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        info += `❌ Erro na conexão: ${error.message}\n`;
      } else {
        info += `✅ Conexão OK\n`;
        info += `Sessão do Supabase: ${data.session ? 'Ativa' : 'Inativa'}\n`;
      }
    } catch (err) {
      info += `❌ Erro ao testar conexão: ${err}\n`;
    }
    
    // Testar se o email existe no sistema
    info += '\n=== TESTE DE USUÁRIO ===\n';
    const testEmail = 'cicero.silva@ifce.edu.br';
    info += `Testando email: ${testEmail}\n`;
    
    try {
      // Tentar buscar usuário por email (isso pode não funcionar devido a permissões)
      const { data: users, error } = await supabase
        .from('auth.users')
        .select('id, email, created_at')
        .eq('email', testEmail)
        .limit(1);
      
      if (error) {
        info += `❌ Erro ao verificar usuário: ${error.message}\n`;
        info += `💡 Isso é normal - a tabela auth.users pode não estar acessível\n`;
      } else {
        if (users && users.length > 0) {
          info += `✅ Usuário encontrado: ${users[0].email}\n`;
          info += `ID: ${users[0].id}\n`;
          info += `Criado em: ${users[0].created_at}\n`;
        } else {
          info += `❌ Usuário não encontrado no sistema\n`;
          info += `💡 Sugestão: Criar novo usuário com este email\n`;
        }
      }
    } catch (err) {
      info += `❌ Erro ao verificar usuário: ${err}\n`;
    }
    
    // Verificar configurações de autenticação
    info += '\n=== CONFIGURAÇÕES ===\n';
    info += `Email deve ser .edu: ${testEmail.includes('.edu') ? '✅' : '❌'}\n`;
    info += `Formato de email válido: ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail) ? '✅' : '❌'}\n`;
    
    setDebugInfo(info);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
        >
          🔍 Debug Auth
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Debug de Autenticação</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <button
            onClick={runDebug}
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Executar Debug
          </button>
          
          {debugInfo && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-96">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthDebug; 