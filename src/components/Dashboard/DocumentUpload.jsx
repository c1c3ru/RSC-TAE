// src/components/Dashboard/DocumentUpload.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function DocumentUpload({ itemId, onUploadSuccess }) {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!file || !currentUser) return;

    try {
      setUploading(true);
      const storageRef = ref(
        storage,
        `users/${currentUser.uid}/docs/${itemId}/${uuidv4()}`
      );
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUploadSuccess(url); // Chama o callback com a URL
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar arquivo. Verifique o console para detalhes.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Adicionar documento:
      </label>
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={(e) => handleUpload(e.target.files[0])}
          disabled={uploading}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-700
            hover:file:bg-blue-200 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <div className="text-sm text-gray-500 animate-pulse">
            Enviando...
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Formatos aceitos: PDF, JPG, PNG, DOC/DOCX (até 5MB)
      </p>
    </div>
  );
}