import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { firestore } from '../services/firebase';
import { userConverter } from '../services/firestore';
import { User } from '../types';

const getUserMap = (users: Array<User> | undefined) => {
  const map: Record<string, User> = {};

  if (users) {
    for (const user of users) {
      map[user.uid] = user;
    }
  }

  return map;
};

export default function useUsers(): {
  users: Record<string, User>;
  loading: boolean;
  error: Error | undefined;
} {
  const [users, loading, error] = useCollectionData(
    collection(firestore, 'users').withConverter(userConverter),
  );

  return {
    users: getUserMap(users),
    loading,
    error,
  };
}
