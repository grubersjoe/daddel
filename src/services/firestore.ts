import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  doc,
} from 'firebase/firestore';

import { FCMToken, Match, Uid, User } from '../types';
import { firestore } from './firebase';

export const getUserRef = (uid: Uid) =>
  doc(firestore, `users/${uid}`).withConverter(userConverter);

export const getMatchRef = (id: string) =>
  doc(firestore, `matches/${id}`).withConverter(matchConverter);


export const fcmTokenConverter: FirestoreDataConverter<FCMToken> = {
    toFirestore: token => token,
    fromFirestore: (snapshot: QueryDocumentSnapshot<FCMToken>) => snapshot.data(),
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
