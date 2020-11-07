import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const FIREBASE_REGION = 'europe-west1'; // Belgium

admin.initializeApp();

exports.isValidInvitationCode = functions
  .region(FIREBASE_REGION)
  .https.onCall((data: { code: string }) => {
    return {
      isValid: data.code === functions.config().daddel.invitation_code,
    };
  });
