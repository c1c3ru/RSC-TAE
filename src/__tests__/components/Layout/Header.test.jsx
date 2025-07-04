import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
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