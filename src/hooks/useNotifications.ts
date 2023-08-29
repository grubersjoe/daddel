import { doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useToken } from 'react-firebase-hooks/messaging';

import { firestore, functions, messaging } from '../services/firebase';
import { fcmTokenConverter } from '../services/firestore';
import useMessagingSupported from './useMessagingSupported';

export default function useNotifications() {
  const [token, tokenLoading, tokenError] = useToken(
    messaging,
    import.meta.env.VITE_VAPID_KEY,
  );

  const storedTokenRef = token
    ? doc(firestore, `fcmTokens/${token}`).withConverter(fcmTokenConverter)
    : undefined;

  const [storedToken, storedTokenLoading, storedTokenError] =
    useDocumentData(storedTokenRef);

  const [functionLoading, setFunctionLoading] = useState(false);
  const loading = tokenLoading || storedTokenLoading || functionLoading;

  const deviceRegistered = storedToken && storedToken.token === token;
  const messagingSupported = useMessagingSupported();

  async function subscribe() {
    if (!messagingSupported) {
      return Promise.reject('Messaging not supported');
    }

    if (loading || !token) {
      return Promise.reject('Request pending');
    }

    setFunctionLoading(true);

    return httpsCallable(
      functions,
      'subscribeToMessaging',
    )({ fcmToken: token }).finally(() => setFunctionLoading(false));
  }

  const unsubscribe = async () => {
    if (!messagingSupported) {
      return Promise.reject('Messaging not supported');
    }

    if (loading || !token) {
      return Promise.reject('Request pending');
    }

    setFunctionLoading(true);
    return httpsCallable(
      functions,
      'unsubscribeFromMessaging',
    )({ fcmToken: token }).finally(() => setFunctionLoading(false));
  };

  return {
    subscribe,
    unsubscribe,
    deviceRegistered,
    loading,
    error: tokenError ?? storedTokenError,
  };
}
