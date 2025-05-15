// src/components/Dashboard/ActivityItem.jsx
import { useEffect, useState } from 'react';
import DocumentUpload from './DocumentUpload';
import { useFirestore } from '../../hooks/useFirestore';
import { calculatePoints } from '../../utils/helpers';

export default function ActivityItem({ item }) {
  const { data, saveData } = useFirestore('activities', item.id);
  const [quantity, setQuantity] = useState(data?.quantity || 0);
  const [documents, setDocuments] = useState(data?.documents || []);

  // Atualiza quando os dados mudam
  useEffect(() => {
    if (data) {
      setQuantity(data.quantity || 0);
      setDocuments(data.documents || []);
    }
  }, [data]);

  const handleSave = async () => {
    await saveData({
      quantity,
      documents,
      lastUpdated: new Date().toISOString()
    });
  };

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
            Pontos: {calculatePoints(quantity, item.pointsPerUnit)}
          </span>
        </div>
      </div>

      {/* Seção de Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">
          Documentos Comprobatórios
        </label>
        <DocumentUpload 
          itemId={item.id}
          onUploadSuccess={(url) => setDocuments([...documents, url])}
        />
        
        {/* Lista de documentos */}
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
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Salvar Alterações
      </button>
    </div>
  );
}