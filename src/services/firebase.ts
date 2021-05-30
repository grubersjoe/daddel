import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';

import { FIREBASE_REGION } from '../constants';

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

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
});

const auth = app.auth();
auth.languageCode = 'de';

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

const analytics = app.analytics();
const firestore = app.firestore();
const functions = app.functions(FIREBASE_REGION);

let messaging: firebase.messaging.Messaging | undefined;
try {
  // This will throw an error on iOS (unsupported)
  messaging = app.messaging();
} catch {}

// Emulators
if (window.location.hostname === 'localhost') {
  if (process.env.REACT_APP_USE_EMULATED_FIRESTORE) {
    firestore.settings({
      host: 'localhost:8080',
      ssl: false,
    });
  }

  functions.useEmulator('localhost', 5001);
}

function getTimestamp(date: Date = new Date()) {
  return firebase.firestore.Timestamp.fromDate(date);
}

export default {
  auth,
  googleAuthProvider,
  analytics,
  firestore,
  functions,
  messaging,
  getTimestamp,
};
