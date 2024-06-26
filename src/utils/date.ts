import {
  addMinutes,
  format,
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
  DEFAULT_TIME_INCREMENT_MINUTES,
  MATCH_TIME_OPEN_END,
  TIME_FORMAT,
} from '../constants/date';
import { TimeString } from '../types';

export function formatDate(timestamp: Timestamp, smartWeekday = true) {
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

export function formatTime(date: Date | Timestamp, timeFormat = TIME_FORMAT) {
  if (date instanceof Date) {
    return format(date, timeFormat);
  }

  return format(date.toDate(), timeFormat);
}

export function timeToDate(time: TimeString, referenceDate: Date) {
  return parseDate(time, TIME_FORMAT, referenceDate);
}

export function timeStringsBetweenDates(
  startDate: Date,
  endDate: Date,
  stepSizeMinutes = DEFAULT_TIME_INCREMENT_MINUTES,
) {
  let currentDate = roundToNearestMinutes(startDate, {
    nearestTo: DEFAULT_TIME_INCREMENT_MINUTES,
  });

  endDate = roundToNearestMinutes(endDate, {
    nearestTo: DEFAULT_TIME_INCREMENT_MINUTES,
  });

  if (isBefore(endDate, currentDate)) {
    throw new RangeError('startDate must be before endDate');
  }

  // Initialize with first value
  const options = [formatTime(currentDate)];

  while (isBefore(currentDate, endDate)) {
    currentDate = addMinutes(currentDate, stepSizeMinutes);
    options.push(formatTime(currentDate));
  }

  return options as Array<TimeString>;
}

export function isOpenEndDate(date: Date | Timestamp) {
  return formatTime(date) === MATCH_TIME_OPEN_END;
}
