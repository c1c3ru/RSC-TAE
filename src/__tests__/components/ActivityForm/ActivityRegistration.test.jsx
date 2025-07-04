/* eslint-disable no-undef */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityRegistration from './ActivityRegistration';
import { CompetencyProvider } from '../../context/CompetencyContext';
import { AuthProvider } from '../../context/AuthContext';
import { LayoutProvider } from '../../context/LayoutContext';

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

// Mock do activityService para garantir dados no contexto e mockar addActivity
jest.mock('../../services/activityService', () => {
  return {
    __esModule: true,
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
    addActivity: jest.fn().mockResolvedValue({ success: true })
  };
});

// Mock do DocumentUploader para não exigir upload real
jest.mock('./DocumentUploader', () => {
  const React = require('react');
  function MockUploader({ onDocumentsChange }) {
    React.useEffect(() => {
      onDocumentsChange && onDocumentsChange([{ file: { type: 'application/pdf' } }]);
    }, [onDocumentsChange]);
    return <div data-testid="mock-uploader">Uploader Mock</div>;
  }
  return {
    __esModule: true,
    default: MockUploader
  };
});

describe('ActivityRegistration', () => {
  it('deve renderizar o formulário de registro de atividade', () => {
    render(
      <AuthProvider>
        <LayoutProvider>
          <CompetencyProvider>
            <ActivityRegistration />
          </CompetencyProvider>
        </LayoutProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/Registrar Nova Atividade/i)).toBeInTheDocument();
  });

  it('deve permitir registrar uma nova atividade', async () => {
    render(
      <AuthProvider>
        <LayoutProvider>
          <CompetencyProvider>
            <ActivityRegistration />
          </CompetencyProvider>
        </LayoutProvider>
      </AuthProvider>
    );

    // Esperar o select de atividade aparecer
    const atividadeSelect = await screen.findByRole('combobox');
    fireEvent.change(atividadeSelect, { target: { value: 'COMP1' } });

    // Preencher campo de quantidade
    const quantidadeInput = await screen.findByLabelText(/Quantidade/i);
    fireEvent.change(quantidadeInput, { target: { value: '2' } });

    // Simular envio do formulário
    const submitButton = screen.getByRole('button', { name: /registrar/i });
    fireEvent.click(submitButton);

    // Verificar se a função de adicionar atividade foi chamada
    await waitFor(() => {
      const { addActivity } = require('../../services/activityService');
      expect(addActivity).toHaveBeenCalled();
    });
  });
}); 