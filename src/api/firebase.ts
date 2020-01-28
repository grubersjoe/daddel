import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = firebase.initializeApp(config);

const auth = app.auth();
auth.languageCode = 'de';

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

const firestore = app.firestore();

function timestamp(date: Date = new Date()) {
  return new firebase.firestore.Timestamp(
    date.getTime() / 1000, // returns ms
    0,
  );
}

export function renewPasswords(password: string) {
  return auth.currentUser?.updatePassword(password);
}

export default {
  auth,
  googleAuthProvider,
  firestore,
  timestamp,
};
