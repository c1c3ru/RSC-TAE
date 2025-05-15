// src/services/api.js
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getActivitiesList() {
  const querySnapshot = await getDocs(collection(db, 'activities'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function updateUserData(uid, data) {
  const userRef = doc(db, 'RSC', uid);
  await setDoc(userRef, data, { merge: true });
}

export async function getUserData(uid) {
  const docRef = doc(db, 'RSC', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}