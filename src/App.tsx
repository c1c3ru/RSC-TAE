
import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompetencyProvider } from './context/CompetencyContext';
import { LayoutProvider } from './context/LayoutContext'; 
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActivityRegistrationPage from './pages/ActivityRegistrationPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';
import SupabaseTest from './utils/SupabaseTest';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado</h1>
            <p className="text-gray-600 mb-4">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

import { useLayout } from './context/LayoutContext';

// Main Layout Component
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
  const { isSidebarCollapsed } = useLayout();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 pt-16 p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Página 404 customizada
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-32 h-32 mb-6 flex items-center justify-center">
        <svg className="w-24 h-24 text-blue-300" fill="none" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="4" />
          <text x="32" y="44" textAnchor="middle" fontSize="32" fill="#3b82f6" fontFamily="Arial, sans-serif">404</text>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-blue-700 mb-2">404 - Página não encontrada</h1>
      <p className="text-gray-600 mb-4">A página que você procura não existe ou foi movida.</p>
      <a href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Voltar ao Dashboard</a>
    </div>
  );
};

// App Content Component
const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/activity-registration" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityRegistrationPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={<ResetPasswordPage />} 
      />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/supabase-test" element={<SupabaseTest />} />      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CompetencyProvider>
            <LayoutProvider>
              <AppContent />
            </LayoutProvider>
          </CompetencyProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
