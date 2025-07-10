
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://nndkowmwzxfbonbldzsc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZGtvd213enhmYm9uYmxkenNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTM1NTMsImV4cCI6MjA2MzA4OTU1M30.qu1ArbyDFJJZehbTU1cY4GldtaazTuiXcvAKAD82xnw';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Get the current session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  return data.session;
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return data.user;
};

/**
 * Check if the user has an active session
 */
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
};

/**
 * Create or update user profile
 */
export const upsertProfile = async (profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select();
  
  if (error) {
    console.error('Error upserting profile:', error);
    throw error;
  }
  
  return data;
};

/**
 * Get user profile
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('Erro inesperado ao buscar perfil:', error);
    return null;
  }
  return data;
};

export default supabase;
