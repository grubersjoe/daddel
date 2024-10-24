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
import {
  CallableRequest,
  HttpsError,
  onCall,
} from 'firebase-functions/v2/https';

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
      .catch((error: unknown) => {
        logger.error(error);
      });
  }
});

export const onUserDelete = onDocumentDeleted('users/{userId}', event => {
  const { data } = event;
  if (data === undefined) {
    return;
  }

  return getFirestore()
    .doc(`users/${data.id}`)
    .delete()
    .then(() => {
      logger.info(`Document users/${data.id} deleted`);
    })
    .catch((error: unknown) => {
      logger.error(error);
    });
});

export const isValidInvitationCode = onCall(
  (req: CallableRequest<{ code: string }>) => ({
    isValid: req.data.code === invitationCode.value(),
  }),
);

export const subscribeToMessaging = onCall(
  (req: CallableRequest<{ fcmToken: string }>) => {
    const { auth, data } = req;
    const { fcmToken } = data;

    if (!auth) {
      const message = `auth is undefined'}`;
      logger.error(message);
      throw new HttpsError('unauthenticated', message);
    }

    return getFirestore()
      .doc(`fcmTokens/${fcmToken}`)
      .set({ token: fcmToken, uid: auth.uid })
      .then(() => {
        logger.info(
          `Successfully subscribed token ${fcmToken} for user ${auth.uid}`,
        );

        return { success: true };
      })
      .catch((error: unknown) => {
        const message = `Error subscribing token ${fcmToken}: ${error instanceof Error ? error.message : 'unknown'}`;
        logger.error(message);
        throw new HttpsError('internal', message);
      });
  },
);

export const unsubscribeFromMessaging = onCall(
  (req: CallableRequest<{ fcmToken: string }>) => {
    const { auth, data } = req;
    const { fcmToken } = data;

    if (!auth) {
      const message = `auth is undefined'}`;
      logger.error(message);
      throw new HttpsError('unauthenticated', message);
    }

    return getFirestore()
      .doc(`fcmTokens/${fcmToken}`)
      .delete()
      .then(() => {
        logger.info(
          `Successfully unsubscribed token ${fcmToken} for user ${auth.uid}`,
        );

        return { success: true };
      })
      .catch((error: unknown) => {
        const message = `Error unsubscribing token ${fcmToken}: ${error instanceof Error ? error.message : 'unknown'}`;
        logger.error(message);

        throw new HttpsError('internal', message);
      });
  },
);

export const onCreateMatch = onDocumentCreated<'matches/{matchId}'>(
  'matches/{matchId}',
  async event => {
    const { data } = event;
    if (data === undefined) {
      return;
    }

    const match = data.data() as Match;
    const posterUid = match.createdBy;

    const tokens = await fetchFcmTokens(posterUid);

    if (tokens.length === 0) {
      return;
    }

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

        return getMessaging()
          .sendEachForMulticast(message)
          .then(batchResponse => {
            const tokensToRemove: Array<
              Promise<FirebaseFirestore.WriteResult>
            > = [];

            batchResponse.responses.forEach((response, index) => {
              const { error } = response;
              if (error !== undefined) {
                logger.error(
                  'Failure sending message to',
                  tokens[index],
                  error.message,
                );

                if (
                  error.code === 'messaging/invalid-registration-token' ||
                  error.code === 'messaging/registration-token-not-registered'
                ) {
                  tokensToRemove.push(
                    getFirestore()
                      .collection('fcmTokens')
                      .doc(tokens[index])
                      .delete(),
                  );
                }
              }
            });

            return Promise.all(tokensToRemove);
          });
      })
      .catch((error: unknown) => {
        logger.error(error);
      });
  },
);

/**
 * Fetch all registered FCM tokens except for the user that posted the match
 */
const fetchFcmTokens = async (posterUid: string) => {
  const fcmTokens: Array<string> = [];

  // An orderBy() clause also filters for existence of the given field.
  // https://firebase.google.com/docs/firestore/query-data/order-limit-data#order_and_limit_data
  await getFirestore()
    .collection('fcmTokens')
    .where('uid', '!=', posterUid)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        fcmTokens.push(doc.id);
      });
    });

  return fcmTokens;
};
