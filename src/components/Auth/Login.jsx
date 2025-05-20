// src/components/Auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
    <g>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.02 3.24l6.35-6.35C34.64 4.17 29.66 2 24 2 15.17 2 7.51 7.27 4 15.19l8.15 6.26C13.9 17.6 18.95 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24c0-1.37-.11-2.63-.3-3.83H24v7.21h12.48c-.56 3.97-2.94 7.38-6.66 9.59l6.99 5.42C43.64 39.16 46.98 34 46.98 24z"></path>
      <path fill="#FBBC05" d="M12.63 32.81l8.15 6.26c2.34 1.81 5.2 2.92 8.99 2.92 5.04 0 9.75-1.87 13.39-5.19l-6.99-5.42c-2.96 2.14-6.72 3.56-10.4 3.56-2.98 0-5.7-.98-7.91-2.66z"></path>
      <path fill="#34A853" d="M4 43.22C8.72 34.9 13.9 28.22 20.41 24l-8.15-6.26C7.51 20.73 4 25.74 4 32.22z"></path>
    </g>
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Falha no login: ' + err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.code === 'auth/popup-closed-by-user' 
        ? 'Login com Google cancelado.' 
        : 'Falha no login com Google: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 hover:shadow-3xl"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-7 text-center text-gray-800">
        Login
      </motion.h2>

      {error && (
        <motion.div variants={itemVariants} className="mb-5 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div variants={itemVariants}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block mb-2 text-sm font-medium text-gray-700">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </motion.div>

        <motion.button
          variants={itemVariants}
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all duration-300"
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </motion.button>
      </form>

      <div className="relative mt-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Ou</span>
        </div>
      </div>

      <motion.button
        variants={itemVariants}
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center bg-white text-gray-700 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 disabled:opacity-50 transition-all duration-300"
      >
        {loading ? 'Carregando...' : (
          <>
            <GoogleIcon />
            Entrar com Google
          </>
        )}
      </motion.button>

      <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-medium transition-colors duration-300">
          Criar nova conta
        </Link>
      </motion.div>
    </motion.div>
  );
}