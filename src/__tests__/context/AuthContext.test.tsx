import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import '@testing-library/jest-dom';

function TestComponent() {
  const { user } = useAuth();
  return <div>{user ? user.name : 'Deslogado'}</div>;
}

describe('AuthContext', () => {
  it('deve mostrar "Deslogado" quando não há usuário', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('Deslogado')).toBeInTheDocument();
  });
}); 