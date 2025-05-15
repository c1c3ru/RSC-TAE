// src/components/Auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
// Exemplo de uso no componente de registro
import { validatePasswordStrength } from "../../utils/validators";
import { formatDate } from "../../utils/helpers";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userData = currentUser ? currentUser : {};
  const { formatDate } = require('../../utils/helpers');
  const { validatePasswordStrength } = require('../../utils/validators'); 
  

  // Validação em tempo real
const handlePasswordChange = (password) => {
  if (!validatePasswordStrength(password)) {
    setError('Senha deve conter mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial');
  }
};

// Formatação de datas
// const formattedDate = formatDate(userData.createdAt, 'dd MMMM yyyy');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/profile');
    } catch (err) {
      setError('Erro ao criar conta: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrar</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handlePasswordChange(e.target.value);
            }}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Criando...' : 'Registrar'}
        </button>
      </form>
      <div className="mt-4 text-center">
        Já tem conta?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}