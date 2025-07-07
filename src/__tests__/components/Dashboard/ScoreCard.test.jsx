import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ScoreCard from '../../../components/Dashboard/ScoreCard';
import { CompetencyProvider } from '../../context/CompetencyContext';
import { AuthProvider } from '../../context/AuthContext.jsx';
import { LayoutProvider } from '../../context/LayoutContext';

// Mock do hook useAuth para simular usuário autenticado
jest.mock('../../../context/AuthContext.jsx', () => {
  const originalModule = jest.requireActual('../../../context/AuthContext.jsx');
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