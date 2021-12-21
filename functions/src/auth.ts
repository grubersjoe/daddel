import { config, logger, region } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

import { FIREBASE_LOCATION } from './constants';

export const isValidInvitationCode = region(FIREBASE_LOCATION).https.onCall(
  (data: { code: string }) => ({
    isValid: data.code === config().daddel.invitation_code,
  }),
);

export const onUserCreate = region(FIREBASE_LOCATION)
  .auth.user()
  .onCreate(userRecord => {
    const mailPasswordProvider = userRecord.providerData.find(
      provider => provider.providerId === 'password',
    );

    // Normal registration does already check invitation code
    if (!mailPasswordProvider) {
      getFirestore()
        .collection('users')
        .doc(userRecord.uid)
        .set({ invited: false }, { merge: true })
        .then(() => {
          logger.info(`Set invitation status of users/${userRecord.uid}`);
        })
        .catch(logger.error);
    }
  });

export const onUserDelete = region(FIREBASE_LOCATION)
  .auth.user()
  .onDelete(userRecord =>
    getFirestore()
      .collection('users')
      .doc(userRecord.uid)
      .delete()
      .then(() => {
        logger.info(`Document users/${userRecord.uid} deleted`);
      })
      .catch(logger.error),
  );
