
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  duration?: number;
}

const SupabaseTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const addResult = (result: TestResult): void => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (index: number, updates: Partial<TestResult>): void => {
    setResults(prev => prev.map((result, i) => 
      i === index ? { ...result, ...updates } : result
    ));
  };

  const runTest = async (
    testName: string, 
    testFn: () => Promise<void>,
    index: number
  ): Promise<void> => {
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      updateResult(index, {
        status: 'success',
        message: 'Teste passou com sucesso',
        duration
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      updateResult(index, {
        status: 'error',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        duration
      });
    }
  };

  const testConnection = async (): Promise<void> => {
    const { data, error } = await supabase.from('user_profile').select('count');
    if (error) throw error;
  };

  const testAuth = async (): Promise<void> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    // Test passed if no error (user can be null if not authenticated)
  };

  const testStorage = async (): Promise<void> => {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
  };

  const testRealtime = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const channel = supabase.channel('test-channel');
      
      const timeout = setTimeout(() => {
        channel.unsubscribe();
        reject(new Error('Timeout: Realtime connection not established'));
      }, 5000);

      channel
        .on('presence', { event: 'sync' }, () => {
          clearTimeout(timeout);
          channel.unsubscribe();
          resolve();
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            clearTimeout(timeout);
            channel.unsubscribe();
            resolve();
          }
        });
    });
  };

  const runAllTests = async (): Promise<void> => {
    setIsRunning(true);
    setResults([]);

    const tests = [
      { name: 'Conexão com Database', fn: testConnection },
      { name: 'Autenticação', fn: testAuth },
      { name: 'Storage', fn: testStorage },
      { name: 'Realtime', fn: testRealtime }
    ];

    // Initialize all test results
    tests.forEach(test => {
      addResult({
        test: test.name,
        status: 'pending',
        message: 'Executando teste...'
      });
    });

    // Run tests sequentially
    for (let i = 0; i < tests.length; i++) {
      await runTest(tests[i].name, tests[i].fn, i);
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']): string => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']): string => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Teste de Conectividade Supabase
            </h1>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? 'Executando...' : 'Executar Testes'}
            </button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.test}</h3>
                    <p className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.message}
                    </p>
                  </div>
                </div>
                {result.duration && (
                  <span className="text-sm text-gray-500">
                    {result.duration}ms
                  </span>
                )}
              </div>
            ))}
          </div>

          {results.length === 0 && !isRunning && (
            <div className="text-center py-8 text-gray-500">
              Clique em "Executar Testes" para iniciar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
