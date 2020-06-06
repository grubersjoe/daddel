import { Match } from '../types';
import { MatchFilter } from '../components/Match/Filter';

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  // Show one specific match (can bail early)
  if (filter.match) {
    const match = matches.find(match => match.id === filter.match);
    return match ? [match] : [];
  }

  // Games
  matches = matches.filter(match => {
    return filter.games.length > 0 && match.game
      ? filter.games.some(filterGame => filterGame.id === match.game)
      : true;
  });

  return matches;
}

export function calcNumberOfEnabledFilters(filter: MatchFilter) {
  return filter.games.length + (filter.match ? 1 : 0);
}
