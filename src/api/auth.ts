import firebase from './firebase';

export function signInWithEmailAndPassword(email: string, password: string) {
  return firebase.auth.signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
  return firebase.auth.signInWithPopup(firebase.googleAuthProvider);
}

export function createUser(email: string, password: string) {
  return firebase.auth.createUserWithEmailAndPassword(email, password);
}

export function resetPassword(email: string) {
  return firebase.auth.sendPasswordResetEmail(email);
}
