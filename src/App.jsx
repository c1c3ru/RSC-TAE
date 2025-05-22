import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ActivityRegistrationPage from './pages/ActivityRegistrationPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompetencyProvider } from './context/CompetencyContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

const AuthenticatedApp = () => {
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    console.log('AuthenticatedApp - Loading:', loading);
    console.log('AuthenticatedApp - Current User:', currentUser);
    console.log('AuthenticatedApp - Is Authenticated:', !!currentUser);
  }, [loading, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const isAuthenticated = !!currentUser;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAuthenticated && <Header />}
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-6 ${isAuthenticated ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          {isAuthenticated ? (
            <CompetencyProvider>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/activity/register" element={<ActivityRegistrationPage />} />
                <Route path="/activity/history" element={<ActivityHistoryPage />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </CompetencyProvider>
          ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
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
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </Router>
  );
}

export default App;
