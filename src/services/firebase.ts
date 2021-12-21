import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
} from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import { FIREBASE_LOCATION } from '../constants';

const configKeys = [
  'REACT_APP_API_KEY',
  'REACT_APP_APP_ID',
  'REACT_APP_AUTH_DOMAIN',
  'REACT_APP_MEASUREMENT_ID',
  'REACT_APP_MESSAGING_SENDER_ID',
  'REACT_APP_PROJECT_ID',
  'REACT_APP_VAPID_KEY',
];

configKeys.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Environmental variable ${key} is not set`);
  }
});

export const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
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
