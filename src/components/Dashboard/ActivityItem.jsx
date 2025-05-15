// src/components/Dashboard/ActivityItem.jsx
import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import { useFirestore } from '../../hooks/useFirestore';

export default function ActivityItem({ item }) {
  const { data, saveData } = useFirestore('RSC', item.id);
  const [quantity, setQuantity] = useState(data?.quantity || 0);

  const handleSave = async () => {
    await saveData({
      [item.id]: {
        quantity,
        documents: data?.documents || []
      }
    });
  };

  return (
    <div className="p-4 mb-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{item.id}. {item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 p-1 border rounded"
          />
          <span className="text-sm">pontos: {quantity * item.pointsPerUnit}</span>
        </div>
      </div>
      
      <DocumentUpload itemId={item.id} />
      
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  );
}