// Configuração de ambiente para URLs de redirecionamento
export const getRedirectUrl = (path) => {
  const baseUrl = import.meta.env.PROD 
    ? import.meta.env.VITE_PRODUCTION_URL || 'https://seu-dominio.com' // Configure sua URL de produção
    : window.location.origin;
  
  return `${baseUrl}${path}`;
};

// URLs específicas para diferentes funcionalidades
export const REDIRECT_URLS = {
  dashboard: () => getRedirectUrl('/dashboard'),
  resetPassword: () => getRedirectUrl('/reset-password'),
  login: () => getRedirectUrl('/login'),
}; 