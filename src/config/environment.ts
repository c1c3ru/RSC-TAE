
interface Environment {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const environment: Environment = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validação das variáveis de ambiente obrigatórias
const validateEnvironment = (): void => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !environment[key as keyof Environment]);
  
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}`);
  }
};

// Validar apenas em desenvolvimento para evitar erros em build
if (environment.isDevelopment) {
  validateEnvironment();
}

export default environment;
export { validateEnvironment };
