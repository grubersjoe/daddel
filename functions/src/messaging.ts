import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { APP_URL } from '.';
import { Game, Match, User } from './types';
import { formatDate, formatTimestamp } from './util/date';

const FIREBASE_REGION = 'europe-west3'; // Frankfurt
const DEFAULT_TOPIC = 'default';

/**
 * @throws functions.https.HttpsError
 */
function validationMessagingArgs(data: Record<string, any>) {
  if (
    typeof data.registrationToken !== 'string' ||
    data.registrationToken.length === 0
  ) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing argument `data.registrationToken`',
    );
  }
}

export const subscribeToMessaging = functions
  .region(FIREBASE_REGION)
  .https.onCall((data, context) => {
    validationMessagingArgs(data);

    const topic = DEFAULT_TOPIC;

    return admin
      .messaging()
      .subscribeToTopic(data.registrationToken, topic)
      .then(() =>
        admin
          .firestore()
          .doc(`users/${context.auth?.uid}`)
          .set({ subscribed: true }, { merge: true }),
      )
      .then(() => {
        functions.logger.info(
          `Successfully subscribed ${data.registrationToken} to topic ${topic}`,
        );

        return { success: true };
      })
      .catch(() => {
        const message = `Error subscribing ${data.registrationToken} to topic ${topic}`;
        functions.logger.error(message);
        throw new functions.https.HttpsError('unknown', message);
      });
  });

export const unsubscribeFromMessaging = functions
  .region(FIREBASE_REGION)
  .https.onCall((data, context) => {
    validationMessagingArgs(data);

    const topic = DEFAULT_TOPIC;

    return admin
      .messaging()
      .unsubscribeFromTopic(data.registrationToken, topic)
      .then(() =>
        admin
          .firestore()
          .doc(`users/${context.auth?.uid}`)
          .set({ subscribed: false }, { merge: true }),
      )
      .then(() => {
        functions.logger.info(
          `Successfully unsubscribed ${data.registrationToken} from topic ${topic}`,
        );

        return { success: true };
      })
      .catch(() => {
        const message = `Error unsubscribing ${data.registrationToken} from topic ${topic}`;
        functions.logger.error(message);
        throw new functions.https.HttpsError('unknown', message);
      });
  });

export const onCreateMatch = functions
  .region(FIREBASE_REGION)
  .firestore.document('matches/{matchId}')
  .onCreate(matchSnap => {
    const match = matchSnap.data() as Match;

    return admin
      .firestore()
      .collection('users')
      .doc(match.createdBy)
      .get()
      .then(userSnap => {
        const user = userSnap.data() as User;

        return match.gameRef
          .get()
          .then(gameSnap => {
            const game = gameSnap.data() as Game;
            const date = `${formatDate(match.date)} um ${formatTimestamp(
              match.date,
            )} Uhr`;

            const message: admin.messaging.Message = {
              notification: {
                title: 'Daddel – Neues Match',
                body: `${user.nickname} hat ein neues Match erstellt: ${game.name} am ${date}.`,
              },
              topic: DEFAULT_TOPIC,
              webpush: {
                fcmOptions: {
                  link: `${APP_URL}/matches/${matchSnap.id}`,
                },
              },
            };

            return admin
              .messaging()
              .send(message)
              .then(response => {
                functions.logger.info('Successfully sent message:', response);
              })
              .catch(error => {
                functions.logger.error('Error sending message:', error);
              });
          })
          .catch(error => {
            functions.logger.error('Unable to retrieve game from match', error);
          });
      })
      .catch(error => {
        functions.logger.error('Unable to retrieve user from match', error);
      });
  });
