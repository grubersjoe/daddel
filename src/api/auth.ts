import { History } from 'history';

import firebase from './firebase';
import ROUTES from '../constants/routes';

export function signInWithEmailAndPassword(email: string, password: string) {
  return firebase.auth.signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
  return firebase.auth.signInWithRedirect(firebase.googleAuthProvider);
}

export function createUser(email: string, password: string) {
  return firebase.auth.createUserWithEmailAndPassword(email, password);
}

export function resetPassword(email: string) {
  return firebase.auth.sendPasswordResetEmail(email);
}

export async function signOut(history: History) {
  await firebase.auth.signOut();
  history.push(ROUTES.ROOT);
}

export async function isValidInvitationCode(code: string): Promise<boolean> {
  return firebase.functions
    .httpsCallable('isValidInvitationCode')({ code })
    .then(function (result) {
      return result.data.isValid as boolean;
    })
    .catch(error => {
      console.error('leerror', error);
      return false;
    });
}
