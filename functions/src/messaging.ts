import { firestore } from 'firebase-admin';
import { https, logger, region } from 'firebase-functions';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getMessaging, Message } from 'firebase-admin/messaging';

import { APP_URL, FIREBASE_LOCATION } from './constants';
import { Game, Match, User } from '../../src/types';
import { formatDate, formatTime } from './util/date';
import DocumentReference = firestore.DocumentReference;

const DEFAULT_TOPIC = 'default';
const MESSAGING_ENABLED = true; // Useful while developing

/**
 * @throws https.HttpsError
 */
function assertPayloadIsMessagingToken(
  data: Record<string, unknown>,
): data is { fcmToken: string } {
  if (typeof data.fcmToken !== 'string' || data.fcmToken.length === 0) {
    throw new https.HttpsError(
      'invalid-argument',
      `Missing or invalid argument data.fcmToken: ${JSON.stringify(data)}`,
    );
  }

  return true;
}

export const subscribeToMessaging = region(FIREBASE_LOCATION).https.onCall(
  (data, context) => {
    assertPayloadIsMessagingToken(data);

    const topic = DEFAULT_TOPIC;

    return getMessaging()
      .subscribeToTopic(data.fcmToken, topic)
      .then(() =>
        getFirestore()
          .doc(`users/${context.auth?.uid}`)
          .update({
            fcmTokens: FieldValue.arrayUnion(data.fcmToken),
          }),
      )
      .then(() => {
        logger.info(
          `Successfully subscribed ${data.fcmToken} to topic ${topic}`,
        );

        return { success: true };
      })
      .catch(() => {
        const message = `Error subscribing ${data.fcmToken} to topic ${topic}`;
        logger.error(message);
        throw new https.HttpsError('unknown', message);
      });
  },
);

export const unsubscribeFromMessaging = region(FIREBASE_LOCATION).https.onCall(
  (data, context) => {
    assertPayloadIsMessagingToken(data);

    const topic = DEFAULT_TOPIC;

    return getMessaging()
      .unsubscribeFromTopic(data.fcmToken, topic)
      .then(() =>
        getFirestore()
          .doc(`users/${context.auth?.uid}`)
          .update({
            fcmTokens: FieldValue.arrayRemove(data.fcmToken),
          }),
      )
      .then(() => {
        logger.info(
          `Successfully unsubscribed ${data.fcmToken} from topic ${topic}`,
        );

        return { success: true };
      })
      .catch(() => {
        const message = `Error unsubscribing ${data.fcmToken} from topic ${topic}`;
        logger.error(message);
        throw new https.HttpsError('unknown', message);
      });
  },
);

export const onCreateMatch = region(FIREBASE_LOCATION)
  .firestore.document('matches/{matchId}')
  .onCreate(matchSnap => {
    const match = matchSnap.data() as Match;

    if (!MESSAGING_ENABLED) {
      logger.warn(
        'No messages have been sent, because the feature is disabled.',
      );

      return Promise.resolve();
    }

    return getFirestore()
      .collection('users')
      .doc(match.createdBy)
      .get()
      .then(userSnap => {
        const user = userSnap.data() as User;

        return (match.game as unknown as DocumentReference) // DocumentReference in Admin is different to Firestore Web
          .get()
          .then(gameSnap => {
            const game = gameSnap.data() as Game;
            const date = `${formatDate(match.date)} um ${formatTime(
              match.date,
            )} Uhr`;

            const message: Message = {
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

            return getMessaging()
              .send(message)
              .then(response =>
                logger.info('Successfully sent message:', response),
              )
              .catch(error => logger.error('Error sending message:', error));
          })
          .catch(error =>
            logger.error('Unable to retrieve game from match', error),
          );
      })
      .catch(error =>
        logger.error('Unable to retrieve user from match', error),
      );
  });
