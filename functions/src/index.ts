import * as admin from 'firebase-admin';

import { isValidInvitationCode, onUserCreate, onUserDelete } from './auth';
import {
  subscribeToMessaging,
  unsubscribeFromMessaging,
  onCreateMatch,
} from './messaging';

export const FIREBASE_REGION = 'europe-west3'; // Frankfurt

admin.initializeApp();

// Auth
export { isValidInvitationCode, onUserCreate, onUserDelete };

// Messaging
export { subscribeToMessaging, unsubscribeFromMessaging, onCreateMatch };
