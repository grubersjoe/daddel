import { useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import firebase from '../api/firebase';
import { User } from '../types';
import { supportsMessaging } from '../utils';

export default function useNotifications() {
  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  const [user, userLoading, userError] = useDocumentData<User>(
    firebase.firestore.doc(`users/${currentUser.uid}`),
  );

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsSubscribed(user.subscribed);
    }
    setLoading(userLoading);
  }, [user, userLoading, userError]);

  function subscribe() {
    if (loading) {
      return Promise.reject('Loading');
    }

    if (!supportsMessaging() || !firebase.messaging) {
      return Promise.reject('Platform is not supported');
    }

    setLoading(true);

    return firebase.messaging
      .getToken({ vapidKey: process.env.REACT_APP_VAPID_KEY })
      .then(registrationToken =>
        firebase.functions.httpsCallable('subscribeToMessaging')({
          registrationToken,
        }),
      )
      .catch(error => Promise.reject(error))
      .finally(() => setLoading(false));
  }

  const unsubscribe = () => {
    if (loading) {
      return Promise.reject('Loading');
    }

    if (!supportsMessaging() || !firebase.messaging) {
      return Promise.reject('Platform is not supported');
    }

    setLoading(true);

    return firebase.messaging
      .getToken({ vapidKey: process.env.REACT_APP_VAPID_KEY })
      .then(registrationToken =>
        firebase.functions.httpsCallable('unsubscribeFromMessaging')({
          registrationToken,
        }),
      )
      .catch(error => Promise.reject(error))
      .finally(() => setLoading(false));
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    loading,
  };
}
