import { orderBy, query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { getCollectionRef } from '../services/firebase';
import { Game } from '../types';

export function useGamesCollectionData() {
  return useCollectionData<Game>(
    query(getCollectionRef('games'), orderBy('name', 'asc')),
    {
      idField: 'id',
    },
  );
}
