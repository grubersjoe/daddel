import { User, UserMap } from '../types';

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function createUserDict(users: Array<User>): UserMap {
  const userMap = new Map<string, User>();

  users.forEach(user => {
    if (!user.uid) {
      throw new Error('user.uid is undefined');
    }

    userMap.set(user.uid, user);
  });

  return userMap;
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
  // Required for iOS
  if (typeof navigator.serviceWorker !== 'undefined') {
    navigator.serviceWorker
      .getRegistration(`${process.env.PUBLIC_URL}/service-worker.js`)
      .then(registration => registration && registration.update());
  }
}
