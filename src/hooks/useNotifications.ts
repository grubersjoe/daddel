import { httpsCallable } from 'firebase/functions';
import { getMessaging, getToken } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { auth, firebaseApp, functions } from '../services/firebase';
import { getUserRef } from '../services/firestore';
import useMessagingSupported from './useMessagingSupported';

export default function useNotifications() {
  const [authUser] = useAuthState(auth);

  const [user, userLoading] = useDocumentData(
    authUser ? getUserRef(authUser.uid) : null,
  );

  const messagingSupported = useMessagingSupported();
  const [deviceRegistered, setDeviceRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!messagingSupported) {
      return;
    }

    setLoading(userLoading);

    if (user) {
      getToken(getMessaging(firebaseApp), {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
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
  }, [messagingSupported, user, userLoading]);

  async function subscribe() {
    if (loading) {
      return Promise.reject('Request pending');
    }

    setLoading(true);

    return getToken(getMessaging(firebaseApp), {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    })
      .then(fcmToken =>
        httpsCallable(functions, 'subscribeToMessaging')({ fcmToken }),
      )
      .catch(error => {
        console.error(error);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  }

  const unsubscribe = () => {
    if (loading) {
      return Promise.reject('Request pending');
    }

    setLoading(true);

    return getToken(getMessaging(firebaseApp), {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    })
      .then(fcmToken =>
        httpsCallable(
          functions,
          'unsubscribeFromMessaging',
        )({
          fcmToken,
        }),
      )
      .catch(error => {
        console.error(error);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  };

  return { subscribe, unsubscribe, deviceRegistered, loading };
}
