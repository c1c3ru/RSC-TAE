// supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase lendo das variáveis de ambiente
// O prefixo VITE_ é necessário para que o Vite exponha a variável no lado do cliente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  // Cria a instância do Supabase APENAS UMA VEZ
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error(
    'Erro Crítico: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_KEY não estão definidas. O cliente Supabase não foi inicializado.'
  );
  // Em um cenário real, você poderia lançar um erro aqui para parar a execução
  // ou ter uma lógica de fallback mais robusta se o app puder funcionar parcialmente sem Supabase.
  // throw new Error('Variáveis de ambiente Supabase ausentes. A aplicação não pode continuar.');
}

// Exporta a ÚNICA instância do cliente Supabase
// Se supabaseInstance for null devido a variáveis ausentes, qualquer tentativa de usá-lo
// resultará em erro, o que é esperado e ajuda a identificar o problema de configuração.
export const supabase = supabaseInstance;

/**
 * Obtém a sessão atual.
 * @returns {Promise<object|null>} A sessão do usuário ou null em caso de erro/sem sessão.
 */
export const getSession = async () => {
  // Verifica se o cliente Supabase foi inicializado
  if (!supabase) {
    console.error('Cliente Supabase não inicializado. Não é possível buscar a sessão.');
    return null;
  }
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao buscar a sessão:', error.message);
    return null;
  }
  return data.session;
};

/**
 * Obtém o usuário atualmente autenticado.
 * @returns {Promise<object|null>} O objeto do usuário ou null em caso de erro/sem usuário.
 */
export const getCurrentUser = async () => {
  if (!supabase) {
    console.error('Cliente Supabase não inicializado. Não é possível buscar o usuário.');
    return null;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Erro ao buscar o usuário:', error);
    return null;
  }
  return data.user;
};

/**
 * Verifica se o usuário tem uma sessão ativa.
 * @returns {Promise<boolean>} True se autenticado, false caso contrário.
 */
export const isAuthenticated = async () => {
  if (!supabase) {
    console.error('Cliente Supabase não inicializado. Não é possível verificar a autenticação.');
    return false; // Retorna false se não puder verificar
  }
  const session = await getSession();
  return !!session;
};

// Exporta a instância do cliente Supabase como default também, para consistência
// se você estiver usando import default em algum lugar.
export default supabase;
