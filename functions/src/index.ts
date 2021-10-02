import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { isValidInvitationCode, onUserCreate, onUserDelete } from './auth';
import {
  onCreateMatch,
  subscribeToMessaging,
  unsubscribeFromMessaging,
} from './messaging';

export const APP_URL: string = functions.config().daddel.app_url;
export const FIREBASE_REGION = 'europe-west3'; // Frankfurt

admin.initializeApp();

// Auth
export { isValidInvitationCode, onUserCreate, onUserDelete };

// Messaging
export { subscribeToMessaging, unsubscribeFromMessaging, onCreateMatch };
