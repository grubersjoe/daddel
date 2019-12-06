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

class Firebase {
  auth: firebase.auth.Auth;
  googleAuthProvider: firebase.auth.GoogleAuthProvider;
  db: firebase.firestore.Firestore;

  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.auth.languageCode = 'de';
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.db = firebase.firestore();
  }

  createUser = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  passwordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  renewPasswords = (password: string) =>
    this.auth.currentUser?.updatePassword(password);
}

export default new Firebase();
