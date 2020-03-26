import { Match } from '../types';
import { MatchFilter } from '../components/Match/Filter';

export function filterMatches(matches: Match[], filter: MatchFilter) {
  // Games
  matches = matches.filter(match => {
    return filter.games.length > 0 && match.game
      ? filter.games.some(filterGame => filterGame.id === match.game)
      : true;
  });

  return matches;
}
