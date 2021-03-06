import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const FIREBASE_REGION = 'europe-west3'; // Frankfurt

export const isValidInvitationCode = functions
  .region(FIREBASE_REGION)
  .https.onCall((data: { code: string }) => ({
    isValid: data.code === functions.config().daddel.invitation_code,
  }));

export const onUserCreate = functions
  .region(FIREBASE_REGION)
  .auth.user()
  .onCreate(userRecord => {
    const mailPasswordProvider = userRecord.providerData.find(
      provider => provider.providerId === 'password',
    );

    // Normal registration does already check invitation code
    if (!mailPasswordProvider) {
      admin
        .firestore()
        .collection('users')
        .doc(userRecord.uid)
        .set({ invited: false }, { merge: true })
        .then(() => {
          functions.logger.info(
            `Set invitation status of users/${userRecord.uid}`,
          );
        })
        .catch(functions.logger.error);
    }
  });

export const onUserDelete = functions
  .region(FIREBASE_REGION)
  .auth.user()
  .onDelete(userRecord =>
    admin
      .firestore()
      .collection('users')
      .doc(userRecord.uid)
      .delete()
      .then(() => {
        functions.logger.info(`Document users/${userRecord.uid} deleted`);
      })
      .catch(functions.logger.error),
  );
