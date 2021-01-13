import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from '../services/firebase';
import { User, UserMap } from '../types';
import { calcUserList } from '../utils';

export default function useUserList(): [Maybe<UserMap>, boolean, Maybe<Error>] {
  const [users, usersLoading, usersError] = useCollectionData<User>(
    firebase.firestore.collection('users'),
    { idField: 'uid' },
  );

  const userList = users ? calcUserList(users) : undefined;

  return [userList, usersLoading, usersError];
}
