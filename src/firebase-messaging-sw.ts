import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

import { firebaseOptions } from './constants/firebase';

if (typeof window !== 'undefined') {
  const firebaseApp = initializeApp(firebaseOptions);

  getMessaging(firebaseApp);
}
