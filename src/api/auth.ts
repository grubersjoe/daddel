import firebase from './firebase';

export function signInWithEmailAndPassword(email: string, password: string) {
  return firebase.auth.signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
  return firebase.auth.signInWithPopup(firebase.googleAuthProvider);
}
