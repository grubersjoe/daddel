import firebase from '../services/firebase';
import { UNKNOWN_GAME_ID } from '../constants';
import { Game, User, UserMap } from '../types';

export function calcUserList(users: User[]): UserMap {
  const userMap = new Map<string, User>();
  users.forEach(user => userMap.set(user.uid, user));

  return userMap;
}

// Move the "unknown game" entry to the end of the games list
export function reorderGames(games: Game[]): Game[] {
  const unknownGame = games.find(game => game.id === UNKNOWN_GAME_ID);

  return unknownGame
    ? games.filter(game => game.id !== UNKNOWN_GAME_ID).concat(unknownGame)
    : games;
}

// See https://developers.google.com/speed/webp/faq#in_your_own_javascript
export function supportsWebp(): Promise<boolean> {
  const img = new Image();

  // Lossy Webp
  img.src =
    'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

  return new Promise(resolve => {
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
  });
}

export function updateServiceWorker(): void {
  navigator.serviceWorker
    .getRegistration(`${process.env.PUBLIC_URL}/service-worker.js`)
    .then(registration => registration && registration.update());
}

export function supportsMessaging(): boolean {
  return (
    firebase.messaging !== undefined &&
    'Notification' in window &&
    'permissions' in window.navigator
  );
}
