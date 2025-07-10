/* eslint-env node, jest */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '@/components/Layout/Sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { CompetencyProvider } from '@/context/CompetencyContext';
import { MemoryRouter } from 'react-router-dom';

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

// Mock do activityService para garantir dados no contexto
jest.mock('../../../services/activityService', () => ({
  getCompetences: jest.fn().mockResolvedValue([
    {
      id: 'COMP1',
      category: 'Administrativas',
      title: 'Competência Teste',
      type: 'EVENTS',
      points_per_unit: 1
    }
  ]),
  getUserActivities: jest.fn().mockResolvedValue([
    {
      id: 1,
      categoria: 'Administrativas',
      pontuacao: 1,
      itemCompetenciaId: 'COMP1',
      status: 'pendente'
    }
  ])
}));

describe('Sidebar', () => {
  it('deve renderizar o menu lateral com o título Menu', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LayoutProvider>
            <CompetencyProvider>
              <Sidebar />
            </CompetencyProvider>
          </LayoutProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
}); 