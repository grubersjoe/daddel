import { useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import firebase from '../services/firebase';
import { User } from '../types';
import { supportsMessaging } from '../utils';

export default function useNotifications() {
  if (!supportsMessaging() || !firebase.messaging) {
    throw new Error('Firebase Messaging not supported on this platform');
  }

  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  const [user, userLoading] = useDocumentData<User>(
    firebase.firestore.doc(`users/${currentUser.uid}`),
  );

  const [deviceRegistered, setDeviceRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && firebase.messaging) {
      firebase.messaging
        .getToken({
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        })
        .then(fcmToken => {
          setDeviceRegistered(
            user.fcmTokens ? user.fcmTokens.includes(fcmToken) : false,
          );
        })
        .catch(error => {
          // Blocked permissions are not an error
          if (error.code !== 'messaging/permission-blocked') {
            throw error;
          }
        });
    }
    setLoading(userLoading);
  }, [user, userLoading]);

  function subscribe() {
    if (loading) {
      return Promise.reject('Request pending');
    }

    if (!firebase.messaging) {
      throw new Error('Platform not supported');
    }

    setLoading(true);

    return firebase.messaging
      .getToken({
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      })
      .then(fcmToken =>
        firebase.functions.httpsCallable('subscribeToMessaging')({ fcmToken }),
      )
      .catch(error => Promise.reject(error))
      .finally(() => setLoading(false));
  }

  const unsubscribe = () => {
    if (loading) {
      return Promise.reject('Request pending');
    }

    if (!firebase.messaging) {
      throw new Error('Platform not supported');
    }

    setLoading(true);

    return firebase.messaging
      .getToken({
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      })
      .then(fcmToken =>
        firebase.functions.httpsCallable('unsubscribeFromMessaging')({
          fcmToken,
        }),
      )
      .catch(error => Promise.reject(error))
      .finally(() => setLoading(false));
  };

  return { subscribe, unsubscribe, deviceRegistered, loading };
}
