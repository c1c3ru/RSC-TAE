
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
// import ActivityHistoryPage from './pages/ActivityHistoryPage'; // Removed import
import './index.css';

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
      {/* Removed /history route block */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompetencyProvider>
          <LayoutProvider> {/* Wrap AppContent with LayoutProvider */}
            <AppContent />
          </LayoutProvider>
        </CompetencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
