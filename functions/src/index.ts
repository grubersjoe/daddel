import { initializeApp } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { MulticastMessage, getMessaging } from 'firebase-admin/messaging';
import { auth, logger } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import {
  onDocumentCreated,
  onDocumentDeleted,
} from 'firebase-functions/v2/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import { Match, User } from '../../src/types';
import { formatDate, formatTime } from './utils';

initializeApp();
setGlobalOptions({ region: 'europe-west3' });

const appUrl = defineString('APP_URL');
const invitationCode = defineString('INVITATION_CODE');

export const onUserCreate = auth.user().onCreate(async user => {
  const hasPasswordProvider = user.providerData.some(
    provider => provider.providerId === 'password',
  );

  // Normal registration already checks the invitation code
  if (!hasPasswordProvider) {
    await getFirestore()
      .doc(`users/${user.uid}`)
      .set({ invited: false }, { merge: true })
      .catch(logger.error);
  }
});

export const onUserDelete = onDocumentDeleted('users/{userId}', event =>
  getFirestore()
    .doc(`users/${event.data.id}`)
    .delete()
    .then(() => logger.info(`Document users/${event.data.id} deleted`))
    .catch(logger.error),
);

export const isValidInvitationCode = onCall(req => ({
  isValid: req.data.code === invitationCode.value(),
}));

export const subscribeToMessaging = onCall(req => {
  const { fcmToken } = req.data;

  return getFirestore()
    .doc(`fcmTokens/${fcmToken}`)
    .set({ token: fcmToken, uid: req.auth.uid })
    .then(() => {
      logger.info(
        `Successfully subscribed token ${fcmToken} for user ${req.auth.uid}`,
      );

      return { success: true };
    })
    .catch(error => {
      const message = `Error subscribing token ${fcmToken}: ${error.message}`;
      logger.error(message);

      throw new HttpsError('internal', message);
    });
});

export const unsubscribeFromMessaging = onCall(req => {
  const { fcmToken } = req.data;

  return getFirestore()
    .doc(`fcmTokens/${fcmToken}`)
    .delete()
    .then(() => {
      logger.info(
        `Successfully unsubscribed token ${fcmToken} for user ${req.auth.uid}`,
      );

      return { success: true };
    })
    .catch(error => {
      const message = `Error unsubscribing token ${fcmToken}: ${error.message}`;
      logger.error(message);

      throw new HttpsError('internal', message);
    });
});

export const onCreateMatch = onDocumentCreated(
  'matches/{matchId}',
  async event => {
    const match = event.data.data() as Match;
    const posterUid = match.createdBy;

    const tokens = await fetchFcmTokens(posterUid);

    return getFirestore()
      .doc(`users/${posterUid}`)
      .get()
      .then(async snapshot => {
        const user = snapshot.data() as User;
        const date = `${formatDate(match.date)} um ${formatTime(
          match.date,
        )} Uhr`;

        const message: MulticastMessage = {
          notification: {
            title: 'Neues Match',
            body: `${user.nickname} hat ein neues Match erstellt: ${match.game.name} am ${date}.`,
          },
          tokens,
          webpush: {
            fcmOptions: {
              link: `${appUrl.value()}/matches/${match.id}`,
            },
          },
        };

        getMessaging()
          .sendEachForMulticast(message)
          .then(batchResponse => {
            if (batchResponse.failureCount > 0) {
              logger.error(batchResponse);
            }
          });
      })
      .catch(logger.error);
  },
);

/**
 * Fetch all registered FCM tokens except for the user that posted the match
 */
const fetchFcmTokens = async (posterUid: string) => {
  const fcmTokens: Array<string> = [];

  console.log({ posterUid });

  // An orderBy() clause also filters for existence of the given field.
  // https://firebase.google.com/docs/firestore/query-data/order-limit-data#order_and_limit_data
  await getFirestore()
    .collection('fcmTokens')
    .where('uid', '!=', posterUid)
    .get()
    .then(snapshot =>
      snapshot.forEach(doc => {
        fcmTokens.push(doc.id);
      }),
    );

  console.log({ fcmTokens });

  return fcmTokens;
};
