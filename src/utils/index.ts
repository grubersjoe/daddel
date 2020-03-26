import { de } from 'date-fns/locale';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import isBefore from 'date-fns/isBefore';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';
import parse from 'date-fns/parse';
import roundToNearestMinutes from 'date-fns/roundToNearestMinutes';

import { TIME_FORMAT } from '../constants/time';
import { Timestamp, User, UserMap } from '../types';

const DATE_FORMAT = 'dd.MM.';

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
) {
  if (typeof timestamp === 'number') {
    return format(fromUnixTime(timestamp), timeFormat);
  }

  return format(fromUnixTime(timestamp.seconds), timeFormat);
}

export function calcTimeLabelsBetweenTimes(
  hourStart: string,
  hourEnd: string,
  stepInMinutes = 15,
) {
  let date = roundToNearestMinutes(parse(hourStart, TIME_FORMAT, new Date()), {
    nearestTo: 15,
  });

  const endDate = roundToNearestMinutes(
    parse(hourEnd, TIME_FORMAT, new Date()),
    { nearestTo: 15 },
  );

  if (isBefore(endDate, date))
    throw new RangeError('hourStart must be before hourEnd');

  const options = [format(date, TIME_FORMAT)];
  while (isBefore(date, endDate)) {
    date = addMinutes(date, stepInMinutes);
    options.push(format(date, TIME_FORMAT));
  }

  return options;
}

export function calcUserList(users: User[]): UserMap {
  const userMap = new Map<string, User>();
  users.forEach(user => userMap.set(user.uid, user));

  return userMap;
}

// See https://developers.google.com/speed/webp/faq#in_your_own_javascript
export function supportsWebp(): Promise<boolean> {
  const img = new Image();

  // Lossy Webp
  img.src =
    'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

  return new Promise(resolve => {
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
  });
}
