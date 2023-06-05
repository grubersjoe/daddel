import { GameOption } from '../components/Match/GameSelect';
import { SteamGame } from '../hooks/useSteamGames';

export function isSteamGame(game: GameOption): game is SteamGame {
  return (game as SteamGame).appid !== undefined;
}
