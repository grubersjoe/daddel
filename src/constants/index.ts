const notSet = (name: string) => `Environmental variable ${name} is not set`;

if (!import.meta.env.VITE_DOMAIN_PROD) {
  throw new Error(notSet('VITE_DOMAIN_PROD'));
}

export const FIREBASE_LOCATION = 'europe-west3'; // Frankfurt
export const DOMAIN_PROD = import.meta.env.VITE_DOMAIN_PROD;
export const REGEX_IPV4 =
  /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

export const LOCALE = 'de';
export const MAX_SHOWN_PAST_MATCHES = 10;

export enum GA_EVENTS {
  ADD_MATCH = 'add_match',
  DELETE_MATCH = 'delete_match',
  JOIN_MATCH = 'join_match',
  LEAVE_MATCH = 'leave_match',
}
