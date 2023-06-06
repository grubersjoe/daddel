import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SteamUser, fetchSteamAuthStatus } from '../services/auth';

export const useSteamUser = () =>
  useQuery<SteamUser | null, AxiosError>({
    queryKey: ['steam-user'],
    queryFn: () => fetchSteamAuthStatus().then(data => data.user),
    cacheTime: 0,
    retry: 1,
  });
