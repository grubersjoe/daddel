import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from '../api/firebase';
import { User, UserMap } from '../types';
import { calcUserList } from '../utils';

export default function useUserList(): [
  UserMap | undefined,
  boolean,
  Error | undefined,
] {
  const [users, usersLoading, usersError] = useCollectionData<User>(
    firebase.firestore.collection('users'),
    { idField: 'uid' },
  );

  return [users ? calcUserList(users) : undefined, usersLoading, usersError];
}
