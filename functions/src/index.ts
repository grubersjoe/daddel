import { initializeApp } from 'firebase-admin/app';

import { isValidInvitationCode, onUserCreate, onUserDelete } from './auth';
import {
  onCreateMatch,
  subscribeToMessaging,
  unsubscribeFromMessaging,
} from './messaging';

initializeApp();

// Auth
export { isValidInvitationCode, onUserCreate, onUserDelete };

// Messaging
export { subscribeToMessaging, unsubscribeFromMessaging, onCreateMatch };
