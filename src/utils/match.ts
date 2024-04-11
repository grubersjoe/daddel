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

  const openEndOnly = untilExceptOpenEnd.length === 0;

  if (openEndOnly) {
    const maxFrom = fromUnixTime(Math.max(...players.map(p => p.from.seconds)));
    return {
      min: minFrom,
      max: minDate([addHours(maxFrom, 2), timeToDate(MATCH_TIME_LATEST)]),
    };
  }

  const withOpenEnd = untilExceptOpenEnd.length < players.length;

  return {
    min: minFrom,
    max: withOpenEnd
      ? minDate([addHours(maxUntil, 0.5), timeToDate(MATCH_TIME_LATEST)])
      : maxUntil,
  };
}
