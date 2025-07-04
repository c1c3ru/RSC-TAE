// Configuração de ambiente para URLs de redirecionamento
// Esta é a URL da SUA aplicação (frontend), não do Supabase
export const getRedirectUrl = (path) => {
  // Para desenvolvimento, use uma URL fixa para evitar problemas com portas dinâmicas
  const baseUrl = import.meta.env.PROD 
    ? (import.meta.env.VITE_PRODUCTION_URL || 'https://seu-site.com') // URL do seu site em produção
    : (import.meta.env.VITE_DEVELOPMENT_URL || 'http://localhost:5175'); // URL local atual
  
  return `${baseUrl}${path}`;
};

// URLs específicas para diferentes funcionalidades
export const REDIRECT_URLS = {
  dashboard: () => getRedirectUrl('/dashboard'),
  resetPassword: () => getRedirectUrl('/reset-password'),
  login: () => getRedirectUrl('/login'),
}; 