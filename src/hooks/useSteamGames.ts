import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useSteamUser } from './useSteamUser';

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
}

interface Response {
  response: {
    game_count: number;
    games: Array<SteamGame>;
  };
}

export const useSteamGames = () => {
  const { data: steamUser } = useSteamUser();

  const url = new URL(
    'https://api.jogruber.de/steam/IPlayerService/GetOwnedGames/v0001?format=json&include_appinfo=1',
  );

  if (steamUser) {
    url.searchParams.append('steamid', steamUser.id);
  }

  return useQuery({
    queryKey: ['steam-apps', steamUser?.id],
    queryFn: () =>
      axios
        .get<Response>(url.toString())
        .then(res => res.data.response.games)
        .then(games =>
          games.sort((a, b) => b.playtime_forever - a.playtime_forever),
        ),
    enabled: Boolean(steamUser),
  });
};
