import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const RLSTest: React.FC = () => {
  const { currentUser, session } = useAuth();
  const [testResults, setTestResults] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const runRLSTests = async () => {
    setLoading(true);
    let results = '=== TESTE DE RLS (Row Level Security) ===\n\n';
    
    if (!currentUser) {
      results += '❌ Usuário não está logado\n';
      setTestResults(results);
      setLoading(false);
      return;
    }

    results += `👤 Usuário logado: ${currentUser.email}\n`;
    results += `🆔 User ID: ${currentUser.id}\n`;
    results += `✅ Email confirmado: ${currentUser.email_confirmed_at ? 'Sim' : 'Não'}\n\n`;

    // Teste 1: Verificar se o usuário pode ler seu próprio perfil
    results += '🔍 TESTE 1: SELECT user_profile\n';
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', currentUser.id);
      
      if (error) {
        results += `❌ Erro: ${error.message}\n`;
        results += `📊 Código: ${error.code}\n`;
        results += `🔍 Detalhes: ${error.details}\n`;
        results += `💡 Sugestão: Verificar política select_own_profile\n\n`;
      } else {
        results += `✅ Sucesso: ${Array.isArray(data) ? data.length : 0} registros encontrados\n`;
        if (Array.isArray(data) && data.length > 0) {
          results += `📋 Dados: ${JSON.stringify(data[0], null, 2)}\n`;
        }
        results += '\n';
      }
    } catch (err) {
      results += `❌ Exceção: ${err}\n\n`;
    }

    // Teste 2: Tentar inserir perfil do usuário
    results += '🔍 TESTE 2: INSERT user_profile\n';
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .upsert([
          {
            id: currentUser.id,
            email: currentUser.email,
            name: 'Teste RLS',
            employee_number: 'TEST001',
            job: 'Teste',
            functional_category: 'TEST',
            date_singin: new Date().toISOString(),
            education: 'Teste'
          }
        ], {
          onConflict: 'id'
        });
      
      if (error) {
        results += `❌ Erro: ${error.message}\n`;
        results += `📊 Código: ${error.code}\n`;
        results += `🔍 Detalhes: ${error.details}\n`;
        results += `💡 Sugestão: Verificar política insert_own_profile\n\n`;
      } else {
        results += `✅ Sucesso: Perfil inserido/atualizado\n`;
        results += `📋 Dados retornados: ${JSON.stringify(data, null, 2)}\n\n`;
      }
    } catch (err) {
      results += `❌ Exceção: ${err}\n\n`;
    }

    // Teste 3: Tentar atualizar perfil do usuário
    results += '🔍 TESTE 3: UPDATE user_profile\n';
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .update({
          name: 'Teste RLS Atualizado',
          employee_number: 'TEST002'
        })
        .eq('id', currentUser.id);
      
      if (error) {
        results += `❌ Erro: ${error.message}\n`;
        results += `📊 Código: ${error.code}\n`;
        results += `🔍 Detalhes: ${error.details}\n`;
        results += `💡 Sugestão: Verificar política update_own_profile\n\n`;
      } else {
        results += `✅ Sucesso: Perfil atualizado\n`;
        results += `📋 Registros afetados: ${data?.length || 0}\n\n`;
      }
    } catch (err) {
      results += `❌ Exceção: ${err}\n\n`;
    }

    // Teste 4: Tentar inserir atividade
    results += '🔍 TESTE 4: INSERT user_rsc\n';
    try {
      const { data, error } = await supabase
        .from('user_rsc')
        .insert([
          {
            user_id: currentUser.id,
            competence_id: 'CAT1',
            points: 10,
            description: 'Teste RLS',
            date: new Date().toISOString(),
            document_url: 'teste.pdf'
          }
        ]);
      
      if (error) {
        results += `❌ Erro: ${error.message}\n`;
        results += `📊 Código: ${error.code}\n`;
        results += `🔍 Detalhes: ${error.details}\n`;
        results += `💡 Sugestão: Verificar política insert_own_rsc\n\n`;
      } else {
        results += `✅ Sucesso: Atividade inserida\n`;
        results += `📋 Dados retornados: ${JSON.stringify(data, null, 2)}\n\n`;
      }
    } catch (err) {
      results += `❌ Exceção: ${err}\n\n`;
    }

    // Teste 5: Tentar ler atividades do usuário
    results += '🔍 TESTE 5: SELECT user_rsc\n';
    try {
      const { data, error } = await supabase
        .from('user_rsc')
        .select('*')
        .eq('user_id', currentUser.id);
      
      if (error) {
        results += `❌ Erro: ${error.message}\n`;
        results += `📊 Código: ${error.code}\n`;
        results += `🔍 Detalhes: ${error.details}\n`;
        results += `💡 Sugestão: Verificar política select_own_rsc\n\n`;
      } else {
        results += `✅ Sucesso: ${data?.length || 0} atividades encontradas\n`;
        if (data && data.length > 0) {
          results += `📋 Primeira atividade: ${JSON.stringify(data[0], null, 2)}\n`;
        }
        results += '\n';
      }
    } catch (err) {
      results += `❌ Exceção: ${err}\n\n`;
    }

    // Teste 6: Verificar competências
    results += '🔍 TESTE 6: SELECT competences\n';
    try {
      const { data, error } = await supabase
        .from('competences')
        .select('*')
        .limit(5);
      
      if (error) {
        results += `❌ Erro: ${error.message}\n`;
        results += `📊 Código: ${error.code}\n`;
        results += `🔍 Detalhes: ${error.details}\n`;
        results += `💡 Sugestão: Verificar política select_competences\n\n`;
      } else {
        results += `✅ Sucesso: ${data?.length || 0} competências encontradas\n`;
        if (data && data.length > 0) {
          results += `📋 Primeira competência: ${JSON.stringify(data[0], null, 2)}\n`;
        }
        results += '\n';
      }
    } catch (err) {
      results += `❌ Exceção: ${err}\n\n`;
    }

    // Resumo das políticas necessárias
    results += '📋 RESUMO DAS POLÍTICAS NECESSÁRIAS:\n';
    results += '• user_profile: select_own_profile, insert_own_profile, update_own_profile\n';
    results += '• user_rsc: select_own_rsc, insert_own_rsc, update_own_rsc, delete_own_rsc\n';
    results += '• competences: select_competences (para todos)\n\n';

    results += '💡 DICAS PARA CORRIGIR:\n';
    results += '1. Verifique se as políticas estão ativas no Supabase Dashboard\n';
    results += '2. Confirme se as condições das políticas estão corretas\n';
    results += '3. Teste as políticas no SQL Editor do Supabase\n';
    results += '4. Verifique se o RLS está habilitado nas tabelas\n';

    setTestResults(results);
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults('');
  };

  // Mostrar apenas em desenvolvimento
  // @ts-expect-error: import.meta.env é suportado pelo Vite
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        {isVisible ? '🔒 Ocultar RLS Test' : '🔓 RLS Test'}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Teste de RLS</h3>
            <button
              onClick={clearResults}
              className="text-gray-500 hover:text-gray-700"
            >
              🗑️
            </button>
          </div>

          <button
            onClick={runRLSTests}
            disabled={loading || !currentUser}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded mb-4 transition-colors"
          >
            {loading ? '🔍 Testando...' : '🔍 Executar Testes RLS'}
          </button>

          {!currentUser && (
            <div className="text-red-600 text-sm mb-4">
              ⚠️ Faça login primeiro para testar as RLS
            </div>
          )}

          {testResults && (
            <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-96">
              <pre className="whitespace-pre-wrap">{testResults}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RLSTest; 