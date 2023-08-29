import { collection, orderBy, query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { firestore } from '../services/firebase';
import { gameConverter } from '../services/firestore';

export function useGamesCollectionData() {
  return useCollectionData(
    query(
      collection(firestore, 'games').withConverter(gameConverter),
      orderBy('name', 'asc'),
    ),
  );
}
