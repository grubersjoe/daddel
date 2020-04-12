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

import { TIME_FORMAT, DATE_FORMAT } from '../constants/date';
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

export function formatDate(timestamp: Timestamp) {
  const date = fromUnixTime(timestamp.seconds);

  if (isYesterday(date)) {
    return `Gestern ${format(date, DATE_FORMAT, { locale: de })}`;
  }

  if (isToday(date)) {
    return `Heute ${format(date, DATE_FORMAT, { locale: de })}`;
  }

  if (isTomorrow(date)) {
    return `Morgen ${format(date, DATE_FORMAT, { locale: de })}`;
  }

  return format(date, `EEEE ${DATE_FORMAT}`, { locale: de });
}

export function formatTimestamp(
  timestamp: Timestamp | number,
  timeFormat = TIME_FORMAT,
): string {
  if (typeof timestamp === 'number') {
    return format(fromUnixTime(timestamp), timeFormat);
  }

  return format(fromUnixTime(timestamp.seconds), timeFormat);
}

/**
 * @throws TypeError|RangeError
 */
export function parseTimeLabel(
  timeLabel: TimeLabel,
  referenceDate = new Date(),
): Date {
  return parse(timeLabel, TIME_FORMAT, referenceDate);
}

export function calcTimeLabelsBetweenDates(
  startDate: Date,
  endDate: Date,
  stepInMinutes = 15,
): TimeLabel[] {
  let currentDate = roundToNearestMinutes(startDate, { nearestTo: 15 });
  endDate = roundToNearestMinutes(endDate, { nearestTo: 15 });

  if (isBefore(endDate, currentDate)) {
    throw new RangeError('startDate must be before endDate');
  }

  // Initialize with first value
  const options = [format(currentDate, TIME_FORMAT) as TimeLabel];

  while (isBefore(currentDate, endDate)) {
    currentDate = addMinutes(currentDate, stepInMinutes);
    options.push(format(currentDate, TIME_FORMAT) as TimeLabel);
  }

  return options;
}
