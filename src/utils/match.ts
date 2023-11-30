import { Player } from '../types';
import { isOpenEndDate } from './date';

interface TimeBounds {
  min: number; // seconds (UNIX timestamp)
  max: number; // seconds (UNIX timestamp)
  withOpenEnd: boolean;
}

export function calcPlayerTimeBounds(players: Array<Player>): TimeBounds {
  const initialValue = {
    min: Infinity,
    max: -Infinity,
    withOpenEnd: false,
  };

  return players.reduce<TimeBounds>((bounds, player) => {
    // Enlarge upper bound for one hour for open end times
    if (isOpenEndDate(player.until)) {
      const min = Math.min(bounds.min, player.from.seconds);

      return {
        min,
        max: Math.max(bounds.max, min + 60 * 60),
        withOpenEnd: true,
      };
    }

    return {
      min: Math.min(bounds.min, player.from.seconds),
      max: Math.max(bounds.max, player.until.seconds),
      withOpenEnd: bounds.withOpenEnd,
    };
  }, initialValue);
}
