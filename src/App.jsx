import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardPage from './pages/DashboardPage';
import ActivityRegistrationPage from './pages/ActivityRegistrationPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompetencyProvider } from './context/CompetencyContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LottieLoader from './components/UI/LottieLoader';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const AuthenticatedApp = () => {
  const { currentUser, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    console.log('AuthenticatedApp - Loading:', loading);
    console.log('AuthenticatedApp - Current User:', currentUser);
    console.log('AuthenticatedApp - Is Authenticated:', !!currentUser);
  }, [loading, currentUser]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
        <LottieLoader />
      </div>
    );
  }
  
  const isAuthenticated = !!currentUser;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAuthenticated && <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />}
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} />}
        <motion.main 
          className={`flex-1 p-6 ${isAuthenticated ? `ml-${isSidebarOpen ? '64' : '16'}` : ''} transition-all duration-300 ease-in-out`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {isAuthenticated ? (
              <CompetencyProvider>
                <Routes>
                  <Route path="/dashboard" element={
                    <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                      <DashboardPage />
                    </motion.div>
                  } />
                  <Route path="/activity/register" element={
                    <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                      <ActivityRegistrationPage />
                    </motion.div>
                  } />
                  <Route path="/activity/history" element={
                    <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                      <ActivityHistoryPage />
                    </motion.div>
                  } />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </CompetencyProvider>
            ) : (
              <Routes>
                <Route path="/" element={
                  <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                    <LoginPage />
                  </motion.div>
                } />
                <Route path="/login" element={
                  <motion.div {...pageTransition} transition={{ duration: 0.3 }}>
                    <LoginPage />
                  </motion.div>
                } />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            )}
          </AnimatePresence>
        </motion.main>
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