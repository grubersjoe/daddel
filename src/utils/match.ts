import { addHours, fromUnixTime, min as minDate } from 'date-fns';

import { MATCH_TIME_LATEST } from '../constants/date';
import { Player } from '../types';
import { isOpenEndDate, timeToDate } from './date';

interface TimeBounds {
  min: Date;
  max: Date;
}

export function calendarTimeBounds(players: Array<Player>): TimeBounds {
  if (players.length === 0) {
    throw new Error('List of players is empty');
  }

  const untilExceptOpenEnd = players.filter(p => !isOpenEndDate(p.until));
  const minFrom = fromUnixTime(Math.min(...players.map(p => p.from.seconds)));
  const maxUntil = fromUnixTime(
    Math.max(...untilExceptOpenEnd.map(p => p.until.seconds)),
  );

  // Only "open end"
  if (untilExceptOpenEnd.length === 0) {
    const maxFrom = fromUnixTime(Math.max(...players.map(p => p.from.seconds)));
    return {
      min: minFrom,
      max: minDate([addHours(maxFrom, 2), timeToDate(MATCH_TIME_LATEST)]),
    };
  }

  // With "open end"
  if (untilExceptOpenEnd.length < players.length) {
    // Times may have no overlap (for example, 18:30-20:30 and 22:00-Open End).
    // So calculate the correct start point:
    const maxUntilOrFrom = fromUnixTime(
      Math.max(
        ...untilExceptOpenEnd.map(p => p.until.seconds),
        ...players.map(p => p.from.seconds),
      ),
    );

    return {
      min: minFrom,
      max: minDate([
        addHours(maxUntilOrFrom, 0.5),
        timeToDate(MATCH_TIME_LATEST),
      ]),
    };
  }

  return {
    min: minFrom,
    max: maxUntil,
  };
}
