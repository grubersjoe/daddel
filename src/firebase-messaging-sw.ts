import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

import { firebaseOptions } from './constants/firebase';

const firebaseApp = initializeApp(firebaseOptions);
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, payload => {
  // eslint-disable-next-line no-console
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
});
