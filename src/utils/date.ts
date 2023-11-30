import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import isBefore from 'date-fns/isBefore';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import { de } from 'date-fns/locale';
import parseDate from 'date-fns/parse';
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes';
import { Timestamp } from 'firebase/firestore';

import {
  DATE_FORMAT,
  DEFAULT_TIME_INCREMENT,
  MATCH_TIME_OPEN_END,
  TIME_FORMAT,
} from '../constants/date';
import { TimeString } from '../types';

export function formatDate(timestamp: Timestamp, smartWeekday = true): string {
  const date = timestamp.toDate();

  if (smartWeekday) {
    if (isToday(date)) {
      return `Heute`;
    }

    if (isTomorrow(date)) {
      return `Morgen`;
    }
  }

  return format(date, DATE_FORMAT, { locale: de });
}

export function formatTime(
  date: Date | Timestamp | number,
  timeFormat = TIME_FORMAT,
) {
  if (date instanceof Date) {
    return format(date, timeFormat);
  }

  if (typeof date === 'number') {
    return format(fromUnixTime(date), timeFormat);
  }

  return format(date.toDate(), timeFormat);
}

export function parseTime(time: TimeString, referenceDate = new Date()): Date {
  return parseDate(time, TIME_FORMAT, referenceDate);
}

export function calcTimeStringsBetweenDates(
  startDate: Date,
  endDate: Date,
  stepInMinutes = DEFAULT_TIME_INCREMENT,
): Array<TimeString> {
  let currentDate = roundToNearestMinutes(startDate, {
    nearestTo: DEFAULT_TIME_INCREMENT,
  });

  endDate = roundToNearestMinutes(endDate, {
    nearestTo: DEFAULT_TIME_INCREMENT,
  });

  if (isBefore(endDate, currentDate)) {
    throw new RangeError('startDate must be before endDate');
  }

  // Initialize with first value
  const options = [formatTime(currentDate)];

  while (isBefore(currentDate, endDate)) {
    currentDate = addMinutes(currentDate, stepInMinutes);
    options.push(formatTime(currentDate));
  }

  return options as Array<TimeString>;
}

export function isOpenEndDate(date: Date | Timestamp | number): boolean {
  return formatTime(date) === MATCH_TIME_OPEN_END;
}
