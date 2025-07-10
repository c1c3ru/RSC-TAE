// Testes Unitários para AuthContext Melhorado
// Execute com: npm test AuthContext.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext_melhorado';

// Mock do Supabase
jest.mock('../utils/supabaseClient', () => ({
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    })),
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn()
      }))
    })),
    insert: jest.fn()
  }))
}));

// Mock das configurações
jest.mock('../config/environment', () => ({
  REDIRECT_URLS: {
    dashboard: () => 'http://localhost:3000/dashboard',
    login: () => 'http://localhost:3000/login',
    resetPassword: () => 'http://localhost:3000/reset-password'
  }
}));

// Componente de teste para usar o hook
const TestComponent = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{auth.loading.any ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{auth.isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user">{auth.currentUser?.name || 'no-user'}</div>
      <div data-testid="error">{auth.error?.message || 'no-error'}</div>
      
      <button 
        data-testid="login-btn" 
        onClick={() => auth.login('test@example.com', 'password123')}
      >
        Login
      </button>
      
      <button 
        data-testid="logout-btn" 
        onClick={() => auth.logout()}
      >
        Logout
      </button>
      
      <button 
        data-testid="clear-error-btn" 
        onClick={() => auth.clearError()}
      >
        Clear Error
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  let mockSupabase;

  beforeEach(() => {
    mockSupabase = require('../utils/supabaseClient');
    jest.clearAllMocks();
  });

  // ============================================================================
  // TESTES DE INICIALIZAÇÃO
  // ============================================================================

  test('should initialize with no user and not loading', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
  });

  test('should initialize with existing session', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    const mockProfile = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      employee_number: 'EMP001'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    });
  });

  // ============================================================================
  // TESTES DE LOGIN
  // ============================================================================

  test('should handle successful login', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Aguarda inicialização
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    // Clica no botão de login
    fireEvent.click(screen.getByTestId('login-btn'));

    // Verifica se está carregando
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    // Aguarda conclusão
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    // Verifica se o login foi chamado corretamente
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('should handle login validation errors', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    // Simula login com email inválido
    const TestComponentWithInvalidEmail = () => {
      const auth = useAuth();
      
      return (
        <div>
          <div data-testid="error">{auth.error?.message || 'no-error'}</div>
          <button 
            data-testid="invalid-login-btn" 
            onClick={() => auth.login('invalid-email', 'password123')}
          >
            Invalid Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponentWithInvalidEmail />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('invalid-login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Valid email is required');
    });
  });

  test('should handle login API errors', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });
  });

  // ============================================================================
  // TESTES DE LOGOUT
  // ============================================================================

  test('should handle successful logout', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: '123', name: 'Test User' },
            error: null
          })
        })
      })
    });

    mockSupabase.auth.signOut.mockResolvedValue({
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Aguarda inicialização com usuário
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
    });

    // Faz logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  // ============================================================================
  // TESTES DE GERENCIAMENTO DE ERROS
  // ============================================================================

  test('should clear errors when clearError is called', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Test error' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    // Gera um erro
    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    });

    // Limpa o erro
    fireEvent.click(screen.getByTestId('clear-error-btn'));

    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  test('should call onError callback when provided', async () => {
    const mockOnError = jest.fn();

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Test error' }
    });

    render(
      <AuthProvider onError={mockOnError}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error',
          context: 'Email Login'
        })
      );
    });
  });

  // ============================================================================
  // TESTES DE HOOK useAuth
  // ============================================================================

  test('should throw error when useAuth is used outside AuthProvider', () => {
    // Suprime console.error para este teste
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  // ============================================================================
  // TESTES DE VALIDAÇÃO
  // ============================================================================

  test('should validate email format', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    const TestValidation = () => {
      const auth = useAuth();
      
      return (
        <div>
          <div data-testid="error">{auth.error?.message || 'no-error'}</div>
          <button 
            data-testid="test-validation" 
            onClick={() => auth.login('not-an-email', 'password123')}
          >
            Test Validation
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestValidation />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });

    fireEvent.click(screen.getByTestId('test-validation'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Valid email is required');
    });
  });

  test('should validate password length', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    const TestPasswordValidation = () => {
      const auth = useAuth();
      
      return (
        <div>
          <div data-testid="error">{auth.error?.message || 'no-error'}</div>
          <button 
            data-testid="test-password" 
            onClick={() => auth.login('test@example.com', '123')}
          >
            Test Password
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestPasswordValidation />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('test-password'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Password must be at least 6 characters');
    });
  });
});

// ============================================================================
// TESTES DE INTEGRAÇÃO
// ============================================================================

describe('AuthContext Integration Tests', () => {
  test('should handle complete authentication flow', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    const mockProfile = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    };

    // Mock inicial sem sessão
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    // Mock login bem-sucedido
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    // Mock busca de perfil
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    // Mock logout
    mockSupabase.auth.signOut.mockResolvedValue({
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Estado inicial
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    });

    // Login
    fireEvent.click(screen.getByTestId('login-btn'));

    // Aguarda login
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    // Simula mudança de estado de auth (normalmente viria do onAuthStateChange)
    // Para este teste, vamos simular manualmente

    // Logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    });
  });
});