import firebase from '../services/firebase';

export const futureMatchesQuery = (referenceDate: Date) =>
  firebase.firestore
    .collection('matches')
    .where('date', '>=', referenceDate)
    .orderBy('date', 'asc');

export const pastMatchesQuery = (referenceDate: Date, limit: number) =>
  firebase.firestore
    .collection('matches')
    .where('date', '<', referenceDate)
    .orderBy('date', 'desc')
    .limit(limit);
