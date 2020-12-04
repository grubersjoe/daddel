import { Match } from '../types';
import { MatchFilter } from '../components/Match/Filter';

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  // Games
  matches = matches.filter(match =>
    filter.games.length > 0
      ? filter.games.some(filterGame => filterGame.id === match.gameRef.id)
      : true,
  );

  return matches;
}

export function calcNumberOfEnabledFilters(filter: MatchFilter) {
  return filter.games.length;
}
