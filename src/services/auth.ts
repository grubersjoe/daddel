import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

import { auth, functions } from './firebase';

export function getCurrentUserId() {
  const uid = auth?.currentUser?.uid;

  if (!uid) {
    throw new Error('Logic error: No authorized user.');
  }

  return uid;
}

export function signInWithGoogle() {
  return signInWithRedirect(auth, new GoogleAuthProvider());
}

export async function isValidInvitationCode(code: string): Promise<boolean> {
  return httpsCallable<{ code: string }, { isValid: boolean }>(
    functions,
    'isValidInvitationCode',
  )({ code })
    .then(result => result.data.isValid)
    .catch(() => false);
}
