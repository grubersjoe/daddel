import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getMessaging } from 'firebase/messaging';

import { FIREBASE_REGION } from '../constants';
import { firebaseOptions } from '../constants/firebase';

export const firebaseApp = initializeApp(firebaseOptions);
export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp, FIREBASE_REGION);
export const messaging = getMessaging(firebaseApp);

// Emulators (but only on localhost!)
if (
  window.location.hostname === 'localhost' &&
  import.meta.env.VITE_USE_EMULATORS.toLowerCase() === 'true'
) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
