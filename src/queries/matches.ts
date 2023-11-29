import { Query, orderBy, query, where } from 'firebase/firestore';

import { getCollectionRef } from '../services/firebase';
import { Match } from '../types';

export const futureMatchesQuery = (referenceDate: Date): Query<Match> =>
  query(
    getCollectionRef('matches'),
    where('date', '>=', referenceDate),
    orderBy('date', 'asc'),
  );
