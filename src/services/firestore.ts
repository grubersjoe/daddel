import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  collection,
  doc,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { Game, Match, Uid, User } from '../types';
import { firestore } from './firebase';

export const getUserRef = (uid: Uid) =>
  doc(firestore, `users/${uid}`).withConverter(userConverter);

export const getMatchRef = (id: string) =>
  doc(firestore, `matches/${id}`).withConverter(matchConverter);

export const futureMatchesQuery = (referenceDate: Date) =>
  query(
    collection(firestore, 'matches').withConverter(matchConverter),
    where('date', '>=', referenceDate),
    orderBy('date', 'asc'),
  );

export const pastMatchesQuery = (referenceDate: Date, maxResults: number) =>
  query(
    collection(firestore, 'matches').withConverter(matchConverter),
    where('date', '<', referenceDate),
    orderBy('date', 'desc'),
    limit(maxResults),
  );

export const gameConverter: FirestoreDataConverter<Game> = {
  toFirestore: game => game,
  fromFirestore: (snapshot: QueryDocumentSnapshot<Game>) => snapshot.data(),
};

export const matchConverter: FirestoreDataConverter<Match> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toFirestore: ({ id, ...match }) => match,
  fromFirestore: (snapshot: QueryDocumentSnapshot<Omit<Match, 'id'>>) => ({
    id: snapshot.id,
    ...snapshot.data(),
  }),
};

export const userConverter: FirestoreDataConverter<User> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toFirestore: ({ uid, ...user }) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot<Omit<User, 'uid'>>) => ({
    uid: snapshot.id,
    ...snapshot.data(),
  }),
};
