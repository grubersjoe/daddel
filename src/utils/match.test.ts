import { Timestamp } from 'firebase/firestore';

import { MATCH_TIME_LATEST, MATCH_TIME_OPEN_END } from '../constants/date';
import { Player } from '../types';
import { timeToDate } from './date';
import { calendarTimeBounds } from './match';

const now = new Date();

describe('calendarTimeBounds()', () => {
  test('should throw error for empty list of players', () => {
    expect(() => calendarTimeBounds([])).toThrow('List of players is empty');
  });

  test('should return correct bounds for one player', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('17:00', now)),
        until: Timestamp.fromDate(timeToDate('18:00', now)),
      },
    ];

    const expected = {
      min: timeToDate('17:00', now),
      max: timeToDate('18:00', now),
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });

  test('should extend bounds by two hours if all players selected "open end"', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('17:00', now)),
        until: Timestamp.fromDate(timeToDate(MATCH_TIME_OPEN_END, now)),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('16:00', now)),
        until: Timestamp.fromDate(timeToDate(MATCH_TIME_OPEN_END, now)),
      },
    ];

    const expected = {
      min: timeToDate('16:00', now),
      max: timeToDate('19:00', now),
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });

  test('should extend bounds by two hours if all players selected "open end" but keep bounds in absolute maximum', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('23:00', now)),
        until: Timestamp.fromDate(timeToDate(MATCH_TIME_OPEN_END, now)),
      },
    ];

    const expected = {
      min: timeToDate('23:00', now),
      max: timeToDate(MATCH_TIME_LATEST, now),
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });

  test('should return correct bounds for several players', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('20:00', now)),
        until: Timestamp.fromDate(timeToDate('22:30', now)),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('20:00', now)),
        until: Timestamp.fromDate(timeToDate('21:30', now)),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('19:00', now)),
        until: Timestamp.fromDate(timeToDate('22:00', now)),
      },
    ];

    const expected = {
      min: timeToDate('19:00', now),
      max: timeToDate('22:30', now),
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });

  test('should extend bounds by half an hour if subset of players selected "open end"', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('20:00', now)),
        until: Timestamp.fromDate(timeToDate('22:30', now)),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('19:00', now)),
        until: Timestamp.fromDate(timeToDate(MATCH_TIME_OPEN_END, now)),
      },
    ];

    const expected = {
      min: timeToDate('19:00', now),
      max: timeToDate('23:00', now), // max until (22:30) + 30 minutes
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });

  test('should extend bounds by half an hour if subset of players selected "open end" without time range overlap', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('18:30', now)),
        until: Timestamp.fromDate(timeToDate('20:30', now)),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(timeToDate('21:00', now)),
        until: Timestamp.fromDate(timeToDate(MATCH_TIME_OPEN_END, now)),
      },
    ];

    const expected = {
      min: timeToDate('18:30', now),
      max: timeToDate('21:30', now),
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });

  test('should use match date for "open end" time selection', () => {
    const players: Array<Player> = [
      {
        uid: 'uid',
        from: Timestamp.fromDate(new Date('2024-01-01 19:00')),
        until: Timestamp.fromDate(new Date('2024-01-01 21:00')),
      },
      {
        uid: 'uid',
        from: Timestamp.fromDate(new Date('2024-01-01 19:00')),
        until: Timestamp.fromDate(
          new Date(`2024-01-01 ${MATCH_TIME_OPEN_END}`),
        ),
      },
    ];

    const expected = {
      min: new Date('2024-01-01 19:00'),
      max: new Date('2024-01-01 21:30'),
    };

    expect(calendarTimeBounds(players)).toEqual(expected);
  });
});
