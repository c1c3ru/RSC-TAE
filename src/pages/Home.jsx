// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          Sistema RSC-TAE
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg mb-6">
            Bem-vindo ao sistema de Reconhecimento de Saberes e Competências para Técnico-Administrativos em Educação.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-3">Para Servidores</h2>
              <p className="mb-4">
                Acesse seu dashboard para registrar suas atividades e documentos comprobatórios.
              </p>
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Acessar Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
            
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-3">Sobre o RSC-TAE</h2>
              <p className="mb-4">
                Conheça os critérios e diretrizes para o reconhecimento de saberes e competências.
              </p>
              <Link
                to="/about"
                className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Saiba Mais
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}