import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getFirestore,
} from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import { FIREBASE_LOCATION } from '../constants';

const configKeys = [
  'VITE_API_KEY',
  'VITE_APP_ID',
  'VITE_AUTH_DOMAIN',
  'VITE_MEASUREMENT_ID',
  'VITE_MESSAGING_SENDER_ID',
  'VITE_PROJECT_ID',
  'VITE_VAPID_KEY',
];

configKeys.forEach(key => {
  if (!import.meta.env[key]) {
    throw new Error(`Environmental variable ${key} is not set`);
  }
});

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  appId: import.meta.env.VITE_APP_ID,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
});

export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp, FIREBASE_LOCATION);

export const getCollectionRef = <T = DocumentData>(name: string) =>
  collection(firestore, name) as unknown as CollectionReference<T>;

export const getDocRef = <T = DocumentData>(path: string, id?: string) => {
  const ref = id ? doc(firestore, path, id) : doc(firestore, path);

  return ref as unknown as DocumentReference<T>;
};

// Emulators
if (window.location.hostname === 'localhost') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
