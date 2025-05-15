// src/components/Layout/Header.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            RSC-TAE
          </Link>
          
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-blue-600">
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}