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
