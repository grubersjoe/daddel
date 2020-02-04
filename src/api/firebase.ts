import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

const auth = app.auth();
auth.languageCode = 'de';

const analytics = app.analytics();
const firestore = app.firestore();

function timestamp(date: Date = new Date()) {
  return new firebase.firestore.Timestamp(
    date.getTime() / 1000, // getTime() returns ms
    0,
  );
}

export default {
  analytics,
  auth,
  firestore,
  googleAuthProvider: new firebase.auth.GoogleAuthProvider(),
  timestamp,
};
