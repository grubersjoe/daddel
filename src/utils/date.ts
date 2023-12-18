import {
  addMinutes,
  format,
  fromUnixTime,
  isBefore,
  isToday,
  isTomorrow,
  parse as parseDate,
  roundToNearestMinutes,
} from 'date-fns';
import { de } from 'date-fns/locale';
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
