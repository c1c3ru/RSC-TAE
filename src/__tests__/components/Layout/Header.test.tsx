import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Layout/Header';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutProvider } from '@/context/LayoutContext';

// Mock do supabaseClient para evitar problemas com import.meta.env
jest.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn() })) })),
      insert: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn() })) }))
    }))
  }
}));

// Mock do hook useAuth para simular usuário autenticado
jest.mock('@/context/AuthContext', () => {
  const originalModule = jest.requireActual('@/context/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      currentUser: { id: 'fake-user', name: 'Usuário Teste', email: 'teste@teste.com' },
      loading: false
    })
  };
});

describe('Header', () => {
  it('deve renderizar o título do sistema', () => {
    render(
      <AuthProvider>
        <LayoutProvider>
          <Header />
        </LayoutProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/Sistema de Competências/i)).toBeInTheDocument();
  });
}); 