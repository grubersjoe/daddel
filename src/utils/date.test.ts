import firebase from 'firebase';
import getUnixTime from 'date-fns/getUnixTime';

import { isOpenEndTimestamp } from './date';

describe('isOpenEndTimestamp()', () => {
  test('should return true if argument is open end timestamp', () => {
    const date = new Date();
    date.setHours(23, 59);

    const firestoreTimestamp = firebase.firestore.Timestamp.fromDate(date);

    expect(isOpenEndTimestamp(firestoreTimestamp)).toBe(true);
    expect(isOpenEndTimestamp(getUnixTime(date))).toBe(true);
  });

  test('should return false if argument is not open end timestamp', () => {
    const date = new Date();
    date.setHours(18, 30);

    const firestoreTimestamp = firebase.firestore.Timestamp.fromDate(date);

    expect(isOpenEndTimestamp(firestoreTimestamp)).toBe(false);
    expect(isOpenEndTimestamp(getUnixTime(date))).toBe(false);
  });
});
