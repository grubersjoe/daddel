const notSet = (name: string) => `Environmental variable ${name} is not set`;

if (!process.env.REACT_APP_UNKNOWN_GAME_FIRESTORE_ID) {
  throw new Error(notSet('REACT_APP_UNKNOWN_GAME_FIRESTORE_ID'));
}

if (!process.env.REACT_APP_DOMAIN_PROD) {
  throw new Error(notSet('REACT_APP_DOMAIN_PROD'));
}

export const FIREBASE_LOCATION = 'europe-west3'; // Frankfurt
export const DOMAIN_PROD = process.env.REACT_APP_DOMAIN_PROD;
export const REGEX_IPV4 =
  /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

export const UNKNOWN_GAME_ID = process.env.REACT_APP_UNKNOWN_GAME_FIRESTORE_ID;
export const MAX_SHOWN_PAST_MATCHES = 10;

export enum GA_EVENTS {
  ADD_MATCH = 'add_match',
  DELETE_MATCH = 'delete_match',
  JOIN_MATCH = 'join_match',
  LEAVE_MATCH = 'leave_match',
}
