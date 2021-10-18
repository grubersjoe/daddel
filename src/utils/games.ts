// Move the "unknown game" entry to the end of the games list
import { Game } from '../types';
import { UNKNOWN_GAME_ID } from '../constants';

export function reorderGames(games: Game[]): Game[] {
  const unknownGame = games.find(game => game.id === UNKNOWN_GAME_ID);

  return unknownGame
    ? games.filter(game => game.id !== UNKNOWN_GAME_ID).concat(unknownGame)
    : games;
}
