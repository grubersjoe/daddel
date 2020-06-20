import { de } from 'date-fns/locale';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { utcToZonedTime } from 'date-fns-tz';

import { Timestamp } from '../types';

const DATE_FORMAT = 'dd.MM.';
const TIME_FORMAT = 'HH:mm';
const TIMEZONE = 'Europe/Berlin';

export function formatDate(timestamp: Timestamp) {
  const date = fromUnixTime(timestamp.seconds);

  return format(date, `EEEE ${DATE_FORMAT}`, { locale: de });
}

export function formatTimestamp(
  timestamp: Timestamp | number,
  timeFormat = TIME_FORMAT,
): string {
  const date = fromUnixTime(
    typeof timestamp === 'number' ? timestamp : timestamp.seconds,
  );

  return format(utcToZonedTime(date, TIMEZONE), timeFormat);
}
