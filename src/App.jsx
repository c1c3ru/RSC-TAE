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
import supabase from './utils/supabaseClient';

// Auth wrapper component
const AuthenticatedApp = () => {
  const { currentUser, loading } = useAuth();
  
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
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/activity/register" 
              element={isAuthenticated ? <ActivityRegistrationPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/activity/history" 
              element={isAuthenticated ? <ActivityHistoryPage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompetencyProvider>
          <AuthenticatedApp />
        </CompetencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;