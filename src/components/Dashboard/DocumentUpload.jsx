// src/components/Dashboard/DocumentUpload.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function DocumentUpload({ itemId }) {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `users/${currentUser.uid}/docs/${itemId}/${uuidv4()}`
      );
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-gray-500 mt-2">Enviando...</p>}
    </div>
  );
}