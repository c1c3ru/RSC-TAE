import Lottie from 'lottie-react';
import notFoundAnimation from '../assets/lottie/404_not_found_animation.json';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-32 h-32 mb-6 flex items-center justify-center">
        <Lottie animationData={notFoundAnimation} style={{ width: 128, height: 128 }} />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Página não encontrada</h1>
      <p className="text-lg text-gray-600 mb-6">Desculpe, a página que você está procurando não existe.</p>
      <a
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
};

export default NotFoundPage; 