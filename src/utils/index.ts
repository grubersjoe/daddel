import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';

import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';

export function formatDate(timestamp: number) {
  const date = fromUnixTime(timestamp);

  if (isYesterday(date)) {
    return `<em>Gestern</em> ${format(date, 'dd.MM. – HH:mm')}`;
  }

  if (isToday(date)) {
    return `<em>Heute</em> ${format(date, 'dd.MM. – HH:mm')}`;
  }

  if (isTomorrow(date)) {
    return `<em>Morgen</em> ${format(date, 'dd.MM. – HH:mm')}`;
  }

  return format(date, 'dd.MM. – HH:mm');
}
