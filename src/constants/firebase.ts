import { FirebaseOptions } from '@firebase/app';

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

export const firebaseOptions = {
  apiKey: import.meta.env.VITE_API_KEY,
  appId: import.meta.env.VITE_APP_ID,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
} satisfies FirebaseOptions;
