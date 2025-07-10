
import { User } from '@supabase/supabase-js';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEducationalEmail = (email: string): boolean => {
  if (!validateEmail(email)) {
    return false;
  }
  
  const domain = email.split('@')[1];
  return domain && domain.includes('.edu');
};

export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  
  // Try to get name from user metadata
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  if (user.user_metadata?.name) {
    return user.user_metadata.name;
  }
  
  // Fallback to email
  return user.email || 'Usuário';
};

export const isUserEmailVerified = (user: User | null): boolean => {
  return user?.email_confirmed_at !== null;
};

export const formatUserRole = (user: User | null): string => {
  if (!user) return '';
  
  const role = user.user_metadata?.role || user.app_metadata?.role;
  
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'teacher':
      return 'Professor';
    case 'student':
      return 'Estudante';
    default:
      return 'Usuário';
  }
};

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignIn: string | null;
}

export const formatUserProfile = (user: User | null): UserProfile | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    fullName: getUserDisplayName(user),
    role: formatUserRole(user),
    emailVerified: isUserEmailVerified(user),
    createdAt: user.created_at,
    lastSignIn: user.last_sign_in_at,
  };
};

export const checkAuthErrors = (error: any): string => {
  if (!error) return '';
  
  // Common Supabase auth error messages
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User not found': 'Usuário não encontrado',
    'Invalid email': 'Email inválido',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'User already registered': 'Usuário já cadastrado',
    'Email rate limit exceeded': 'Muitas tentativas de email. Tente novamente mais tarde.',
    'Signup is disabled': 'Cadastro desabilitado',
  };
  
  const errorMessage = error.message || error.error_description || '';
  
  return errorMappings[errorMessage] || errorMessage || 'Erro de autenticação';
};
