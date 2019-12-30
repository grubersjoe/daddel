import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { de } from 'date-fns/locale';

import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';

import { QuerySnapshot, User } from '../types';

const DATE_FORMAT = 'dd.MM.';

export function formatDate(timestamp: number) {
  const date = fromUnixTime(timestamp);

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

export function calcUserList(users: QuerySnapshot) {
  const userMap = new Map<string, User>();

  users?.docs.forEach(user => {
    const data = user.data() as User;
    userMap.set(data.uid, data);
  });

  return userMap;
}
