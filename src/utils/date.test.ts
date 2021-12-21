import { Timestamp } from 'firebase/firestore';
import getUnixTime from 'date-fns/getUnixTime';

import { isOpenEndDate, parseTime } from './date';

describe('isOpenEndDate()', () => {
  test('should return true if argument is open end timestamp', () => {
    const date = parseTime('23:59');
    const firestoreTimestamp = Timestamp.fromDate(date);

    expect(isOpenEndDate(date)).toBe(true);
    expect(isOpenEndDate(firestoreTimestamp)).toBe(true);
    expect(isOpenEndDate(getUnixTime(date))).toBe(true);
  });

  test('should return false if argument is not open end timestamp', () => {
    const date = parseTime('18:30');
    const firestoreTimestamp = Timestamp.fromDate(date);

    expect(isOpenEndDate(date)).toBe(false);
    expect(isOpenEndDate(firestoreTimestamp)).toBe(false);
    expect(isOpenEndDate(getUnixTime(date))).toBe(false);
  });
});
