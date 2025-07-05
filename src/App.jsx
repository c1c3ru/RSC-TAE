import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompetencyProvider } from './context/CompetencyContext';
import { LayoutProvider } from './context/LayoutContext'; // Import LayoutProvider
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActivityRegistrationPage from './pages/ActivityRegistrationPage';
import ProfilePage from './pages/ProfilePage';
import SupabaseTest from './components/SupabaseTest';
// import ActivityHistoryPage from './pages/ActivityHistoryPage'; // Removed import
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
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
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Detalhes do erro</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

import { useLayout } from './context/LayoutContext'; // Import useLayout for MainLayout

// Main Layout Component
const MainLayout = ({ children }) => {
  const { isSidebarCollapsed } = useLayout(); // Get sidebar state

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        {/* Adjust left margin based on sidebar state */}
        <main className={`flex-1 pt-16 p-8 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

// App Content Component
const AppContent = () => {
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
        path="/register" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityRegistrationPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      {/* Removed /history route block */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CompetencyProvider>
            <LayoutProvider> {/* Wrap AppContent with LayoutProvider */}
              <AppContent />
            </LayoutProvider>
          </CompetencyProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
