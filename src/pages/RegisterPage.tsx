import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CARGOS_TAE } from '../constants/cargos';
import { ESCOLARIDADES } from '../constants/texts';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOGIN_TEXTS } from '../constants/texts';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cargo, setCargo] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [functionalCategory, setFunctionalCategory] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split('@')[1];
    if (!domain || !domain.includes('.edu')) return false;
    return true;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!validateEmail(email)) {
      setError(LOGIN_TEXTS.emailNaoEdu);
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError(ERROR_MESSAGES.senhaMinima);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(ERROR_MESSAGES.confirmarSenha);
      setLoading(false);
      return;
    }
    try {
      await register(email, password, {
        name,
        matricula,
        cargo,
        escolaridade,
        functionalCategory
      });
      setSuccess(SUCCESS_MESSAGES.cadastroRealizado);
      setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setMatricula(''); setCargo(''); setEscolaridade(''); setFunctionalCategory('');
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.erroDesconhecido);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-4 text-blue-600 hover:underline flex items-center"
        >
          ← Voltar para o login
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="text" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <select value={cargo} onChange={e => setCargo(e.target.value)} className="w-full px-3 py-2 border rounded" required>
            <option value="">Selecione o cargo</option>
            {CARGOS_TAE.map(c => (
              <option key={c.codigo} value={c.nome}>{c.nome}</option>
            ))}
          </select>
          <select value={escolaridade} onChange={e => setEscolaridade(e.target.value)} className="w-full px-3 py-2 border rounded" required>
            <option value="">Selecione a escolaridade</option>
            {ESCOLARIDADES.map((esc, idx) => (
              <option key={idx} value={esc}>{esc}</option>
            ))}
          </select>
          <input type="text" placeholder="Categoria Funcional (opcional)" value={functionalCategory} onChange={e => setFunctionalCategory(e.target.value)} className="w-full px-3 py-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        </form>
        {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        <div className="mt-6 text-center">
          Já tem cadastro?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Clique aqui para voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 