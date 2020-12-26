import firebase from './firebase';

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

export function signOut() {
  return firebase.auth.signOut();
}

export async function isValidInvitationCode(code: string): Promise<boolean> {
  return firebase.functions
    .httpsCallable('isValidInvitationCode')({ code })
    .then(result => result.data.isValid as boolean)
    .catch(() => false);
}
