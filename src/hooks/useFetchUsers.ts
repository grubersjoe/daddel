import { useCollectionData } from 'react-firebase-hooks/firestore';

import { getCollectionRef } from '../services/firebase';
import { Maybe, User, UserMap } from '../types';
import { createUserDict } from '../utils';

export default function useFetchUsers(): [
  Maybe<UserMap>,
  boolean,
  Maybe<Error>,
] {
  const [users, usersLoading, usersError] = useCollectionData<User>(
    getCollectionRef('users'),
    { idField: 'uid' },
  );

  return [users ? createUserDict(users) : undefined, usersLoading, usersError];
}
