import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface SteamApp {
  [id: string]: {
    success: boolean;
    data: {
      type: string;
      name: string;
      steam_appid: number;
      header_image: string;
      background: string;
      screenshots: Array<{
        id: number;
        path_thumbnail: string;
        path_full: string;
      }>;
    };
  };
}

export const useSteamApp = (steamAppId: number | null) => {
  const url = new URL(
    `https://api.jogruber.de/steam-store/appdetails?appids=${steamAppId}`,
  );

  return useQuery({
    queryKey: ['steam-app', steamAppId],
    queryFn: () =>
      axios
        .get<SteamApp>(url.toString())
        .then(res => res.data[steamAppId as number].data),
    cacheTime: 1000 * 60 * 60, // 1h
    enabled: typeof steamAppId === 'number',
    refetchOnWindowFocus: false,
  });
};
