import { useQuery } from '@tanstack/react-query';

import { SteamUser, fetchSteamAuthStatus } from '../services/auth';

export const useSteamUser = () =>
  useQuery<SteamUser | null>({
    queryKey: ['steam-user'],
    queryFn: () => fetchSteamAuthStatus().then(data => data.user),
    cacheTime: 0,
  });
