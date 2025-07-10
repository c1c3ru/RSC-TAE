import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreCard from '@/components/Dashboard/ScoreCard';
import { CompetencyProvider } from '@/context/CompetencyContext';
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
  ]),
  createActivity: jest.fn(),
  updateActivityStatus: jest.fn(),
  deleteActivity: jest.fn()
}));

describe('ScoreCard', () => {
  it('deve renderizar o ScoreCard com dados de pontuação', async () => {
    render(
      <AuthProvider>
        <LayoutProvider>
          <CompetencyProvider>
            <ScoreCard />
          </CompetencyProvider>
        </LayoutProvider>
      </AuthProvider>
    );
    expect(await screen.findByText(/Pontuação Total/i)).toBeInTheDocument();
  });
}); 