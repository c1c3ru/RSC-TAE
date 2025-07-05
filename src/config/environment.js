// Configuração de ambiente para URLs de redirecionamento
// Esta é a URL da SUA aplicação (frontend), não do Supabase

// Função para limpar e validar URLs
const cleanUrl = (url) => {
  if (!url) return '';
  // Remove espaços extras e caracteres invisíveis
  return url.trim().replace(/\s+/g, '');
};

// Função para detectar automaticamente a URL base
const getBaseUrl = () => {
  // Se estamos em produção (Vercel, Netlify, etc.)
  if (import.meta.env.PROD) {
    // Verificar se estamos no Vercel
    const isVercel = window.location.hostname.includes('vercel.app');
    const isLocalhost = window.location.hostname.includes('localhost');
    
    console.log('🔍 Debug - Hostname:', window.location.hostname);
    console.log('🔍 Debug - É Vercel:', isVercel);
    console.log('🔍 Debug - É Localhost:', isLocalhost);
    
    // Se estamos no Vercel, usar a URL de produção
    if (isVercel) {
      return cleanUrl('https://rsc-tae.vercel.app');
    }
    
    // Se estamos em localhost mas em produção, usar URL de produção
    if (isLocalhost) {
      return cleanUrl('https://rsc-tae.vercel.app');
    }
    
    // Caso contrário, usar a URL atual
    return cleanUrl(window.location.origin);
  }
  
  // Em desenvolvimento
  return cleanUrl(import.meta.env.VITE_DEVELOPMENT_URL || 'http://localhost:5173');
};

export const getRedirectUrl = (path) => {
  const baseUrl = getBaseUrl();
  const cleanPath = cleanUrl(path);
  const fullUrl = `${baseUrl}${cleanPath}`;
  
  console.log('🔗 URL de redirecionamento (limpa):', fullUrl);
  console.log('🔍 Debug - Base URL:', baseUrl);
  console.log('🔍 Debug - Path:', cleanPath);
  
  return fullUrl;
};

// URLs específicas para diferentes funcionalidades
export const REDIRECT_URLS = {
  dashboard: () => getRedirectUrl('/dashboard'),
  resetPassword: () => getRedirectUrl('/reset-password'),
  login: () => getRedirectUrl('/login'),
}; 