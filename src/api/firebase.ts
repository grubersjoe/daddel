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

let messaging;
try {
  messaging = app.messaging();
} catch (error) {
  messaging = undefined;
}

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

function timestamp(date: Date = new Date()) {
  return new firebase.firestore.Timestamp(
    date.getTime() / 1000, // getTime() returns ms
    0,
  );
}

const exports = {
  analytics,
  auth,
  firestore,
  functions,
  googleAuthProvider,
  messaging,
  timestamp,
};

export default exports;
