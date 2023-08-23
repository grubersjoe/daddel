import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { logger } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import { Match, User } from '../../src/types';
import { formatDate, formatTime } from './utils/date';

setGlobalOptions({ region: 'europe-west3' });

const appUrl = defineString('APP_URL');
const defaultTopic = 'default';

export const subscribeToMessaging = onCall({}, req => {
  const topic = defaultTopic;
  const { uid, fcmToken } = req.data;

  return getMessaging()
    .subscribeToTopic(fcmToken, topic)
    .then(() =>
      getFirestore()
        .doc(`users/${uid}`)
        .update({
          fcmTokens: FieldValue.arrayUnion(fcmToken),
        }),
    )
    .then(() => {
      logger.info(`Successfully subscribed ${fcmToken} to topic ${topic}`);

      return { success: true };
    })
    .catch(() => {
      const message = `Error subscribing ${fcmToken} to topic ${topic}`;
      logger.error(message);
      throw new HttpsError('unknown', message);
    });
});

export const unsubscribeFromMessaging = onCall({}, req => {
  const topic = defaultTopic;
  const { uid, fcmToken } = req.data;

  return getMessaging()
    .unsubscribeFromTopic(fcmToken, topic)
    .then(() =>
      getFirestore()
        .doc(`users/${uid}`)
        .update({
          fcmTokens: FieldValue.arrayRemove(fcmToken),
        }),
    )
    .then(() => {
      logger.info(`Successfully unsubscribed ${fcmToken} from topic ${topic}`);

      return { success: true };
    })
    .catch(() => {
      const message = `Error unsubscribing ${fcmToken} from topic ${topic}`;
      logger.error(message);
      throw new HttpsError('unknown', message);
    });
});

export const onCreateMatch = onDocumentCreated('matches/{matchId}', event => {
  const match = event.data.data() as Match;

  return getFirestore()
    .collection('users')
    .doc(match.createdBy)
    .get()
    .then(userSnapshot => {
      const user = userSnapshot.data() as User;

      const date = `${formatDate(match.date)} um ${formatTime(match.date)} Uhr`;

      const message: Message = {
        notification: {
          title: 'Daddel – Neues Match',
          body: `${user.nickname} hat ein neues Match erstellt: ${match.game.name} am ${date}.`,
        },
        topic: defaultTopic,
        webpush: {
          fcmOptions: {
            link: `${appUrl.value()}/matches/${match.id}`,
          },
        },
      };

      return getMessaging()
        .send(message)
        .then(response => logger.info('Successfully sent message:', response))
        .catch(error => logger.error('Error sending message:', error));
    })
    .catch(error => logger.error('Unable to retrieve user from match', error));
});
