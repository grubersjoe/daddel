import { MatchFilter } from '../components/Match/Filter';
import { Match } from '../types';

export function filterMatches(
  matches: Array<Match>,
  filter: MatchFilter,
): Array<Match> {
  return filterByGame(matches, filter);
}

function filterByGame(
  matches: Array<Match>,
  filter: MatchFilter,
): Array<Match> {
  return matches.filter(match =>
    filter.games.length > 0
      ? filter.games.some(filterGame => filterGame.id === match.game.id)
      : true,
  );
}

export function calcNumberOfEnabledFilters(filter: MatchFilter): number {
  return filter.games.length;
}
