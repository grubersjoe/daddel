import { Timestamp } from 'firebase/firestore';
import { de } from 'date-fns/locale';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { utcToZonedTime } from 'date-fns-tz';

const DATE_FORMAT = 'dd.MM.';
const TIME_FORMAT = 'HH:mm';
const TIMEZONE = 'Europe/Berlin';

export function formatDate(timestamp: Timestamp) {
  return format(timestamp.toDate(), `EEEE ${DATE_FORMAT}`, { locale: de });
}

export function formatTime(
  timestamp: Timestamp | number,
  timeFormat = TIME_FORMAT,
): string {
  const date = fromUnixTime(
    typeof timestamp === 'number' ? timestamp : timestamp.seconds,
  );

  return format(utcToZonedTime(date, TIMEZONE), timeFormat);
}
