import { de } from 'date-fns/locale';
import addMinutes from 'date-fns/addMinutes';
import formatDateFns from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import isBefore from 'date-fns/isBefore';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';
import parse from 'date-fns/parse';
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes';

import {
  TIME_FORMAT,
  DATE_FORMAT,
  DEFAULT_TIME_INCREMENT,
  MATCH_TIME_OPEN_END,
} from '../constants/date';
import { Timestamp, TimeLabel } from '../types';

export function format<R extends string = string>(
  date: Date | number,
  format: string,
  options?: {
    locale?: Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: number;
    useAdditionalWeekYearTokens?: boolean;
    useAdditionalDayOfYearTokens?: boolean;
  },
): R {
  return formatDateFns(date, format, options) as R;
}

export function formatDate(timestamp: Timestamp, smartWeekday = true) {
  const date = timestamp.toDate();

  if (smartWeekday) {
    if (isYesterday(date)) {
      return `Gestern ${format(date, DATE_FORMAT, { locale: de })}`;
    }

    if (isToday(date)) {
      return `Heute ${format(date, DATE_FORMAT, { locale: de })}`;
    }

    if (isTomorrow(date)) {
      return `Morgen ${format(date, DATE_FORMAT, { locale: de })}`;
    }
  }

  return format(date, `EEEE ${DATE_FORMAT}`, { locale: de });
}

export function formatTime<R extends string = string>(
  date: Date | Timestamp | number,
  timeFormat = TIME_FORMAT,
): R {
  if (date instanceof Date) {
    return format<R>(date, timeFormat);
  }

  if (typeof date === 'number') {
    return format<R>(fromUnixTime(date), timeFormat);
  }

  return format<R>(date.toDate(), timeFormat);
}

export function parseTimeLabel(
  timeLabel: TimeLabel,
  referenceDate = new Date(),
): Date {
  return parse(timeLabel, TIME_FORMAT, referenceDate);
}

export function calcTimeLabelsBetweenDates(
  startDate: Date,
  endDate: Date,
  stepInMinutes = DEFAULT_TIME_INCREMENT,
): TimeLabel[] {
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
  const options = [formatTime<TimeLabel>(currentDate)];

  while (isBefore(currentDate, endDate)) {
    currentDate = addMinutes(currentDate, stepInMinutes);
    options.push(formatTime<TimeLabel>(currentDate));
  }

  return options;
}

export function isOpenEndDate(date: Date | Timestamp | number) {
  return formatTime(date) === MATCH_TIME_OPEN_END;
}
