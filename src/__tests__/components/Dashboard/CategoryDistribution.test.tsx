import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryDistribution from '../../../components/Dashboard/CategoryDistribution';
import { CompetencyProvider } from '../../../../context/CompetencyContext';
import { AuthProvider } from '../../../../context/AuthContext';
import { LayoutProvider } from '../../../../context/LayoutContext';

// Mock do hook useAuth para simular usuário autenticado
jest.mock('../../../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../../../context/AuthContext');
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

describe('CategoryDistribution', () => {
  it('deve renderizar o gráfico de distribuição de categorias', async () => {
    render(
      <AuthProvider>
        <LayoutProvider>
          <CompetencyProvider>
            <CategoryDistribution />
          </CompetencyProvider>
        </LayoutProvider>
      </AuthProvider>
    );
    expect(await screen.findByText(/Distribuição por Categoria/i)).toBeInTheDocument();
  });
}); 