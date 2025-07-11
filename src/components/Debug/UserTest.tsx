import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserTest: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('cicero.silva@ifce.edu.br');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Cícero Silva');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleCreateUser = async () => {
    setLoading(true);
    setResult('');
    
    try {
      await register(email, password, {
        nome: name,
        email: email,
        matricula: '12345',
        cargo: 'Técnico Administrativo',
        escolaridade: 'Graduação'
      });
      
      setResult('✅ Usuário criado com sucesso! Agora você pode fazer login.');
    } catch (error) {
      setResult(`❌ Erro ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="text-sm font-semibold mb-2">🧪 Teste de Criação de Usuário</h3>
        
        <div className="space-y-2 text-xs">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-2 py-1 border rounded text-xs"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-2 py-1 border rounded text-xs"
          />
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="w-full px-2 py-1 border rounded text-xs"
          />
          
          <button
            onClick={handleCreateUser}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Usuário'}
          </button>
        </div>
        
        {result && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTest; 