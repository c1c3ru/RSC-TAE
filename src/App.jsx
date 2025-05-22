import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ActivityRegistrationPage from './pages/ActivityRegistrationPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext'; // Importe useAuth
import { CompetencyProvider } from './context/CompetencyContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
// import supabase from './utils/supabaseClient'; // Não precisa importar supabase aqui

// Auth wrapper component
const AuthenticatedApp = () => {
  const { currentUser, loading } = useAuth(); // Use o hook useAuth para acessar o estado

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const isAuthenticated = !!currentUser;

  // Renderize os Providers que dependem de autenticação APENAS quando o usuário estiver autenticado
  // Isso garante que CompetencyProvider só tentará buscar dados se houver uma sessão
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAuthenticated && <Header />}
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-6 ${isAuthenticated ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          {/* O CompetencyProvider é colocado aqui para que só seja montado se isAuthenticated for verdadeiro */}
          {isAuthenticated ? (
            <CompetencyProvider>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/activity/register" element={<ActivityRegistrationPage />} />
                <Route path="/activity/history" element={<ActivityHistoryPage />} />
                {/* Redireciona a raiz para o dashboard se estiver autenticado */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </CompetencyProvider>
          ) : (
            <Routes>
              {/* Se não estiver autenticado, sempre redireciona para o login na rota raiz ou diretamente no /login */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Catch-all para redirecionar qualquer outra rota para login se não autenticado */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider deve ser o provedor mais externo */}
        <AuthenticatedApp /> {/* AuthenticatedApp lida com a lógica de carregamento e renderização condicional */}
      </AuthProvider>
    </Router>
  );
}

export default App;