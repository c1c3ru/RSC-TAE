import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../../components/Layout/Header';
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