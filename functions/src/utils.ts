import { format, fromUnixTime } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { de } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

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

  return format(toZonedTime(date, TIMEZONE), timeFormat);
}
