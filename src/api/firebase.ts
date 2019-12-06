import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export class Firebase {
  auth: firebase.auth.Auth;
  store: firebase.firestore.Firestore;

  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.store = firebase.firestore();
  }

  createUser = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  login = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  logout = () => this.auth.signOut();

  passwordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  renewPasswords = (password: string) =>
    this.auth.currentUser?.updatePassword(password);
}

export default Firebase;
