// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import DocumentUpload from '../components/Dashboard/DocumentUpload';

export default function Profile() {
  const { currentUser } = useAuth();
  const { data, saveData } = useFirestore('RSC', currentUser?.uid);
  const [educationalLevel, setEducationalLevel] = useState('');

  useEffect(() => {
    if (data) {
      setEducationalLevel(data.educationalLevel || '');
    }
  }, [data]);

  const handleSave = async () => {
    await saveData({
      educationalLevel,
      educationalDocs: data?.educationalDocs || []
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block mb-2 font-medium">Nível Educacional:</label>
          <select
            value={educationalLevel}
            onChange={(e) => setEducationalLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            <option value="RSC-TAE I">Ensino Fundamental Incompleto</option>
            <option value="RSC-TAE II">Ensino Fundamental Completo</option>
            <option value="RSC-TAE III">Ensino Médio/Técnico</option>
            <option value="RSC-TAE IV">Graduação</option>
            <option value="RSC-TAE V">Especialização</option>
            <option value="RSC-TAE VI">Mestrado/Doutorado</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Documentos Comprobatórios:</h3>
          <DocumentUpload itemId="educational" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {data?.educationalDocs?.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Documento {index + 1}
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Salvar Perfil
        </button>
      </div>
    </div>
  );
}