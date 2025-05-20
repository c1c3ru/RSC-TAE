// src/hooks/useFirestore.js
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Exportação nomeada corrigida
export function useFirestore(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const docRef = doc(db, collectionName, docId);

  const fetchData = async () => {
    try {
      const docSnap = await getDoc(docRef);
      setData(docSnap.exists() ? docSnap.data() : null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData) => {
    try {
      await setDoc(docRef, newData, { merge: true });
      await fetchData();
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [docId]);

  return { data, loading, error, saveData };
}

// Exportação padrão adicional (opcional)
export default useFirestore;