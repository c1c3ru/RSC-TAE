import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ActivityRegistrationPage from './pages/ActivityRegistrationPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { CompetencyProvider } from './context/CompetencyContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

function App() {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('user') !== null;

  return (
    <AuthProvider>
      <CompetencyProvider>
        <Router>
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
                    element={<LoginPage />} 
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
        </Router>
      </CompetencyProvider>
    </AuthProvider>
  );
}

export default App;