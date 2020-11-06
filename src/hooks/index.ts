import { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from '../api/firebase';
import { User, UserMap } from '../types';
import { calcUserList } from '../utils';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  const goOnline = () => setIsOnline(true);
  const goOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}

export function useUserList(): [
  UserMap | undefined,
  boolean,
  Error | undefined,
] {
  const [users, usersLoading, usersError] = useCollectionData<User>(
    firebase.firestore.collection('users'),
    { idField: 'uid' },
  );

  if (usersError) {
    console.error(usersError);
  }

  return [users ? calcUserList(users) : undefined, usersLoading, usersError];
}
