import { useEffect, useState } from 'react';
import { isSameDay, startOfToday } from 'date-fns';

import useWindowFocused from './useWindowFocused';

/**
 * Returns (start of) of today.
 * The date will be automatically updated as soon as the browser window is focused.
 */
export default function useCurrentDate(): Date {
  const windowFocused = useWindowFocused();
  const [currentDate, setCurrentDate] = useState(startOfToday());

  useEffect(() => {
    const today = startOfToday();
    if (windowFocused && !isSameDay(today, currentDate)) {
      setCurrentDate(today);
    }
  }, [windowFocused, currentDate]);

  return currentDate;
}
