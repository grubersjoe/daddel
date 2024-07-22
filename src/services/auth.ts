import axios from 'axios';
import { httpsCallable } from 'firebase/functions';

import { functions } from './firebase';

export interface SteamUser {
  id: string;
  displayName: string;
}

export interface StatusResponse {
  authUrl: string;
  user: SteamUser | null;
}

export function fetchSteamAuthStatus() {
  return axios
    .get<StatusResponse>(import.meta.env.VITE_STEAM_AUTH_API as string, {
      withCredentials: true,
    })
    .then(res => res.data);
}

export async function signInSteam() {
  const steam = await fetchSteamAuthStatus();

  if (steam.user) {
    return steam.user;
  }

  const authUrl = new URL(steam.authUrl);
  authUrl.searchParams.append('returnUrl', window.location.href);

  window.location.href = authUrl.toString();
}

export function signOutFromSteam() {
  return axios.get<StatusResponse>(
    `${import.meta.env.VITE_STEAM_AUTH_API}/logout`,
    {
      withCredentials: true,
    },
  );
}

export async function isValidInvitationCode(code: string): Promise<boolean> {
  return httpsCallable<{ code: string }, { isValid: boolean }>(
    functions,
    'isValidInvitationCode',
  )({ code })
    .then(result => result.data.isValid)
    .catch(() => false);
}
