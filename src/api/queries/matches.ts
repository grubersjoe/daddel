import startOfToday from 'date-fns/startOfToday';

import firebase from '../firebase';

export const futureMatchesQuery = firebase.firestore
  .collection('matches')
  .where('date', '>=', startOfToday())
  .orderBy('date', 'asc');

export const pastMatchesQuery = (limit: number) =>
  firebase.firestore
    .collection('matches')
    .where('date', '<', startOfToday())
    .orderBy('date', 'desc')
    .limit(limit);
