import { limit, orderBy, Query, query, where } from 'firebase/firestore';

import { Match } from '../types';
import { getCollectionRef } from '../services/firebase';

export const futureMatchesQuery = (referenceDate: Date): Query<Match> =>
  query(
    getCollectionRef('matches'),
    where('date', '>=', referenceDate),
    orderBy('date', 'asc'),
  );

export const pastMatchesQuery = (
  referenceDate: Date,
  maxResults: number,
): Query<Match> =>
  query(
    getCollectionRef('matches'),
    where('date', '<', referenceDate),
    orderBy('date', 'desc'),
    limit(maxResults),
  );
