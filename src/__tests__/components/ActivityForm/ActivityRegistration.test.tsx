import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActivityRegistration from '@/components/ActivityForm/ActivityRegistration';
import { CompetencyProvider } from '@/context/CompetencyContext';
import { AuthProvider } from '@/context/AuthContext';
import { LayoutProvider } from '@/context/LayoutContext';
import * as React from 'react';
import * as activityService from '../../../services/activityService';

// Mock do supabaseClient para evitar problemas com import.meta.env
jest.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: {} }),
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

// Mock do activityService para garantir dados no contexto e mockar addActivity
jest.mock('../../../services/activityService', () => {
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
    createActivity: jest.fn().mockResolvedValue({ success: true })
  };
});

// Mock do DocumentUploader para não exigir upload real
jest.mock('../../../components/ActivityForm/DocumentUploader', () => {
  function MockUploader({ onDocumentsChange }: { onDocumentsChange?: (docs: { file: { type: string } }[]) => void }) {
    React.useEffect(() => {
      if (onDocumentsChange) {
        onDocumentsChange([{ file: { type: 'application/pdf' } }]);
      }
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
    expect(screen.getByText(/Cadastrar Nova Atividade/i)).toBeInTheDocument();
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
    const submitButton = screen.getByRole('button', { name: /Cadastrar Atividade/i });
    fireEvent.click(submitButton);

    // Verificar se a função de adicionar atividade foi chamada
    await waitFor(() => {
      expect(activityService.createActivity).toHaveBeenCalled();
    });
  });
}); 