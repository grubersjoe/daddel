import { User, UserMap } from '../types';

export function calcUserList(users: User[]): UserMap {
  const userMap = new Map<string, User>();
  users.forEach(user => userMap.set(user.uid, user));

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
