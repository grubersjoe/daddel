import getUnixTime from 'date-fns/getUnixTime';
import { Timestamp } from 'firebase/firestore';

import { MATCH_TIME_OPEN_END } from '../constants/date';
import { Player } from '../types';
import { parseTime } from './date';
import { calcPlayerTimeBounds } from './match';

describe('calcPlayerTimeBounds()', () => {
  test('should return initial value for empty player list', () => {
    const players: Array<Player> = [];
    const expected = {
      min: Infinity,
      max: -Infinity,
      withOpenEnd: false,
    };

    expect(expected).toEqual(calcPlayerTimeBounds(players));
  });

  test('should return correct bounds for one player', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('17:00')),
        until: Timestamp.fromDate(parseTime('18:00')),
      },
    ];

    const expected = {
      min: getUnixTime(parseTime('17:00')),
      max: getUnixTime(parseTime('18:00')),
      withOpenEnd: false,
    };

    expect(expected).toEqual(calcPlayerTimeBounds(players));
  });

  test('should return correct bounds for one player with open end time', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('16:00')),
        until: Timestamp.fromDate(parseTime(MATCH_TIME_OPEN_END)),
      },
    ];

    const expected = {
      min: getUnixTime(parseTime('16:00')),
      max: getUnixTime(parseTime('17:00')),
      withOpenEnd: true,
    };

    expect(expected).toEqual(calcPlayerTimeBounds(players));
  });

  test('should return correct bounds for several players', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('20:00')),
        until: Timestamp.fromDate(parseTime('22:30')),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('20:00')),
        until: Timestamp.fromDate(parseTime('21:30')),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('19:00')),
        until: Timestamp.fromDate(parseTime('22:00')),
      },
    ];

    const expected = {
      min: getUnixTime(parseTime('19:00')),
      max: getUnixTime(parseTime('22:30')),
      withOpenEnd: false,
    };

    expect(expected).toEqual(calcPlayerTimeBounds(players));
  });

  test('should detect open end and keep correct upper bound', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('20:00')),
        until: Timestamp.fromDate(parseTime('22:30')),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(parseTime('19:00')),
        until: Timestamp.fromDate(parseTime(MATCH_TIME_OPEN_END)),
      },
    ];

    const expected = {
      min: getUnixTime(parseTime('19:00')),
      max: getUnixTime(parseTime('22:30')),
      withOpenEnd: true,
    };

    expect(expected).toEqual(calcPlayerTimeBounds(players));
  });
});
