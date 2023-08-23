import { getFirestore } from 'firebase-admin/firestore';
import { auth, logger } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';

setGlobalOptions({ region: 'europe-west3' });

const invitationCode = defineString('INVITATION_CODE');

export const isValidInvitationCode = onCall({}, req => ({
  isValid: req.data.code === invitationCode.value(),
}));

export const onUserCreate = auth.user().onCreate(userRecord => {
  const hasPasswordProvider = userRecord.providerData.some(
    provider => provider.providerId === 'password',
  );

  // Normal registration already checks the invitation code
  if (!hasPasswordProvider) {
    return getFirestore()
      .collection('users')
      .doc(userRecord.uid)
      .set({ invited: false }, { merge: true })
      .then(() => {
        logger.info(`Set invitation status of users/${userRecord.uid}`);
      })
      .catch(logger.error);
  }

  return Promise.resolve();
});
export const onUserDelete = onDocumentDeleted('users/{userId}', event =>
  getFirestore()
    .collection('users')
    .doc(event.data.id)
    .delete()
    .then(() => {
      logger.info(`Document users/${event.data.id} deleted`);
    })
    .catch(logger.error),
);
