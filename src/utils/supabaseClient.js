// supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase lendo das variáveis de ambiente
// O prefixo VITE_ é necessário para que o Vite exponha a variável no lado do cliente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Verificação básica para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_KEY não estão definidas. Verifique seu arquivo .env.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Obtém a sessão atual.
 * @returns {Promise<object|null>} A sessão do usuário ou null em caso de erro/sem sessão.
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao buscar a sessão:', error);
    return null;
  }
  return data.session;
};

/**
 * Obtém o usuário atualmente autenticado.
 * @returns {Promise<object|null>} O objeto do usuário ou null em caso de erro/sem usuário.
 */
export const getCurrentUser = async () => {
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
  const session = await getSession();
  return !!session;
};

// Exporta a instância do cliente Supabase como default
export default supabase;