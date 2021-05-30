import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { APP_URL } from '.';
import { Game, Match, User } from './types';
import { formatDate, formatTime } from './util/date';

const FIREBASE_REGION = 'europe-west3'; // Frankfurt
const DEFAULT_TOPIC = 'default';
const MESSAGING_ENABLED = true; // Useful while developing

/**
 * @throws functions.https.HttpsError
 */
function validationMessagingArgs(data: Record<string, any>) {
  if (typeof data.fcmToken !== 'string' || data.fcmToken.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing argument `data.fcmToken`',
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
      .subscribeToTopic(data.fcmToken, topic)
      .then(() =>
        admin
          .firestore()
          .doc(`users/${context.auth?.uid}`)
          .update({
            fcmTokens: admin.firestore.FieldValue.arrayUnion(data.fcmToken),
          }),
      )
      .then(() => {
        functions.logger.info(
          `Successfully subscribed ${data.fcmToken} to topic ${topic}`,
        );

        return { success: true };
      })
      .catch(() => {
        const message = `Error subscribing ${data.fcmToken} to topic ${topic}`;
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
      .unsubscribeFromTopic(data.fcmToken, topic)
      .then(() =>
        admin
          .firestore()
          .doc(`users/${context.auth?.uid}`)
          .update({
            fcmTokens: admin.firestore.FieldValue.arrayRemove(data.fcmToken),
          }),
      )
      .then(() => {
        functions.logger.info(
          `Successfully unsubscribed ${data.fcmToken} from topic ${topic}`,
        );

        return { success: true };
      })
      .catch(() => {
        const message = `Error unsubscribing ${data.fcmToken} from topic ${topic}`;
        functions.logger.error(message);
        throw new functions.https.HttpsError('unknown', message);
      });
  });

export const onCreateMatch = functions
  .region(FIREBASE_REGION)
  .firestore.document('matches/{matchId}')
  .onCreate(matchSnap => {
    const match = matchSnap.data() as Match;

    if (!MESSAGING_ENABLED) {
      functions.logger.warn(
        'No messages have been sent, because the feature is disabled.',
      );

      return Promise.resolve();
    }

    return admin
      .firestore()
      .collection('users')
      .doc(match.createdBy)
      .get()
      .then(userSnap => {
        const user = userSnap.data() as User;

        return match.game
          .get()
          .then(gameSnap => {
            const game = gameSnap.data() as Game;
            const date = `${formatDate(match.date)} um ${formatTime(
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
