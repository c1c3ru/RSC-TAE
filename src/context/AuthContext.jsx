import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email, password) => {
    // In a real application, this would make an API call
    // For now, we'll simulate a successful login with mock data
    
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock user data
    const userData = {
      id: 1,
      nome: 'João Silva',
      email: email,
      matricula: 'MAT12345',
      cargo: 'Analista Administrativo',
      perfil: 'servidor'
    };
    
    // Save user to localStorage and state
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    
    return userData;
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
  // Register function (would be implemented in a real app)
  const register = async (userInfo) => {
    // In a real app, this would make an API call
    // For now, we'll just throw an error
    throw new Error('Registro não implementado nesta versão de demonstração');
  };
  
  // Forgot password function (would be implemented in a real app)
  const forgotPassword = async (email) => {
    // In a real app, this would trigger a password reset email
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.' };
  };
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    forgotPassword
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};