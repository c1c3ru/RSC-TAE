import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, COMMON_TEXTS } from '../constants/texts';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
      if (error) throw error;
      setSuccess(SUCCESS_MESSAGES.dadosSalvos);
      setEmail('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.erroDesconhecido);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{loading ? 'Enviando...' : 'Enviar link de recuperação'}</button>
        </form>
        {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        <button type="button" onClick={() => navigate('/login')} className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">{COMMON_TEXTS.voltar} para Login</button>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 