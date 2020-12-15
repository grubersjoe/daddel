if (!process.env.REACT_APP_UNKNOWN_GAME_FIRESTORE_ID) {
  throw new Error(
    `Environmental variable REACT_APP_UNKNOWN_GAME_FIRESTORE_ID is not set`,
  );
}

if (!process.env.REACT_APP_DOMAIN_PROD) {
  throw new Error(`Environmental variable REACT_APP_DOMAIN_PROD is not set`);
}

export const FIREBASE_REGION = 'europe-west3'; // Frankfurt
export const DOMAIN_PROD = process.env.REACT_APP_DOMAIN_PROD;

export const UNKNOWN_GAME_ID = process.env.REACT_APP_UNKNOWN_GAME_FIRESTORE_ID;
export const MATCH_NOTIFICATION_TIME = 30; // minutes before match
