// src/components/Layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-8 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="mb-2">
          Sistema de Reconhecimento de Saberes e Competências - RSC-TAE
        </p>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}