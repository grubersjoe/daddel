import firebase from './firebase';

export function isValidInvitationCode(code: string): Promise<boolean> {
  return firebase.functions
    .httpsCallable('isValidInvitationCode')({ code })
    .then(result => result.data.isValid as boolean)
    .catch(() => false);
}
