import { httpsCallable } from 'firebase/functions';

import { functions } from './firebase';

export async function isValidInvitationCode(code: string): Promise<boolean> {
  return httpsCallable<{ code: string }, { isValid: boolean }>(
    functions,
    'isValidInvitationCode',
  )({ code })
    .then(result => result.data.isValid)
    .catch(() => false);
}
