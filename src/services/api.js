// src/services/api.js
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getActivitiesList(userId) {
  try {
    if (!userId) throw new Error('ID do usuário não fornecido');

    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro no getActivitiesList:', error);
    throw error;
  }
}