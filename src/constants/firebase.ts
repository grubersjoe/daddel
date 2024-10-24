import { FirebaseOptions } from 'firebase/app';

import { getEnv } from '../utils/env';

const variableNames = [
  'VITE_API_KEY',
  'VITE_APP_ID',
  'VITE_AUTH_DOMAIN',
  'VITE_DOMAIN_PROD',
  'VITE_MEASUREMENT_ID',
  'VITE_MESSAGING_SENDER_ID',
  'VITE_PROJECT_ID',
  'VITE_STEAM_AUTH_API',
  'VITE_VAPID_KEY',
];

variableNames.forEach(key => {
  if (!import.meta.env[key]) {
    throw new Error(`Environmental variable ${key} is not set`);
  }
});

export const firebaseOptions = {
  apiKey: getEnv('VITE_API_KEY'),
  appId: getEnv('VITE_APP_ID'),
  authDomain: getEnv('VITE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_PROJECT_ID'),
  measurementId: getEnv('VITE_MEASUREMENT_ID'),
  messagingSenderId: getEnv('VITE_MESSAGING_SENDER_ID'),
} satisfies FirebaseOptions;
