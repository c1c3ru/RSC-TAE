import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CARGOS_TAE } from '../constants/cargos';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cargo, setCargo] = useState('');
  const [escolaridade, setEscolaridade] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(email, password);
      // Após registro, salvar dados adicionais no perfil
      // (pode ser feito via trigger no Supabase ou update via API)
      setSuccess('Cadastro realizado! Verifique seu e-mail para ativar a conta.');
      setName(''); setEmail(''); setPassword(''); setMatricula(''); setCargo(''); setEscolaridade('');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="text" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <select value={cargo} onChange={e => setCargo(e.target.value)} className="w-full px-3 py-2 border rounded" required>
            <option value="">Selecione o cargo</option>
            {CARGOS_TAE.map(c => (
              <option key={c.codigo} value={c.nome}>{c.nome}</option>
            ))}
          </select>
          <input type="text" placeholder="Escolaridade" value={escolaridade} onChange={e => setEscolaridade(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        </form>
        {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterPage; 