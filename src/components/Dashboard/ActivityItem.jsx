// src/components/Dashboard/ActivityItem.jsx
import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import DocumentUpload from './DocumentUpload';

export default function ActivityItem({ item }) {
  const { data, loading, error, saveData } = useFirestore('activities', item.id);
  const [quantity, setQuantity] = useState(0);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (data) {
      setQuantity(data.quantity || 0);
      setDocuments(data.documents || []);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await saveData({
        quantity,
        documents,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Erro ao salvar atividade:', err);
    }
  };

  if (error) {
    return (
      <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500">
        <p className="text-red-700">Erro ao carregar dados da atividade</p>
      </div>
    );
  }

  return (
    <div className="p-4 mb-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        </div>
        
        <div className="ml-4 flex items-center gap-3">
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded text-center"
          />
          <span className="text-sm font-medium">
            Pontos: {quantity * (item.pointsPerUnit || 0)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <DocumentUpload 
          itemId={item.id}
          onUploadSuccess={(url) => setDocuments([...documents, url])}
        />
        
        <div className="mt-2 space-y-1">
          {documents.map((doc, index) => (
            <a
              key={index}
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <span className="mr-2">📄</span>
              Documento {index + 1}
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </div>
  );
}