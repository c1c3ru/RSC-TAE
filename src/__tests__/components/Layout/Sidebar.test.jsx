/* eslint-env node, jest */
/* global global, require */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { AuthProvider } from '../../context/AuthContext';
import { LayoutProvider } from '../../context/LayoutContext';
import { CompetencyProvider } from '../../context/CompetencyContext';
import { MemoryRouter } from 'react-router-dom';

// Mock do hook useAuth para simular usuário autenticado
jest.mock('../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../context/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      currentUser: { id: 'fake-user', name: 'Usuário Teste', email: 'teste@teste.com' },
      loading: false
    })
  };
});

// Mock do activityService para garantir dados no contexto
jest.mock('../../services/activityService', () => ({
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
              <Sidebar isOpen={true} />
            </CompetencyProvider>
          </LayoutProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Menu/i)).toBeInTheDocument();
  });
}); 