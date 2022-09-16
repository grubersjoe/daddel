// Move the "unknown game" entry to the end of the games list
import { UNKNOWN_GAME_ID } from '../constants';
import { Game } from '../types';

export function reorderGames(games: Array<Game>): Array<Game> {
  const unknownGame = games.find(game => game.id === UNKNOWN_GAME_ID);

  return unknownGame
    ? games.filter(game => game.id !== UNKNOWN_GAME_ID).concat(unknownGame)
    : games;
}
