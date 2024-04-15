import { Timestamp } from 'firebase/firestore';

import { isOpenEndDate, timeToDate } from './date';

const now = new Date();

describe('isOpenEndDate()', () => {
  test('should return true if argument is open end timestamp', () => {
    const date = timeToDate('23:59', now);
    const firestoreTimestamp = Timestamp.fromDate(date);

    expect(isOpenEndDate(date)).toBe(true);
    expect(isOpenEndDate(firestoreTimestamp)).toBe(true);
  });

  test('should return false if argument is not open end timestamp', () => {
    const date = timeToDate('18:30', now);
    const firestoreTimestamp = Timestamp.fromDate(date);

    expect(isOpenEndDate(date)).toBe(false);
    expect(isOpenEndDate(firestoreTimestamp)).toBe(false);
  });
});
