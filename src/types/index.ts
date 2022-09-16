import { DocumentReference, Timestamp } from 'firebase/firestore';

declare global {
  type Maybe<T> = T | undefined;
}

type Uid = string;

export interface Game {
  id?: string;
  maxPlayers?: number;
  name: string;
}

export interface Match {
  id?: string;
  created: Timestamp;
  createdBy: Uid;
  date: Timestamp;
  description?: string;
  game: DocumentReference<Game>;
  players: Array<Player>;
  reactions?: Array<Reaction>;
}

export interface Reaction {
  emoji: string;
  userRefs: Array<DocumentReference<User>>;
}

export interface Player {
  uid: Uid;
  from: Timestamp;
  until: Timestamp;
}

export interface User {
  uid?: Uid;
  nickname: string;
  invited: boolean;
  fcmTokens?: Array<string>;
}

export type UserMap = Map<User['uid'], User>;

// Unfortunately, TypeScript is not able to dynamically generate this type
export type TimeString =
  | '09:00'
  | '09:15'
  | '09:30'
  | '09:45'
  | '10:00'
  | '10:15'
  | '10:30'
  | '10:45'
  | '11:00'
  | '11:15'
  | '11:30'
  | '11:45'
  | '12:00'
  | '12:15'
  | '12:30'
  | '12:45'
  | '13:00'
  | '13:15'
  | '13:30'
  | '13:45'
  | '14:00'
  | '14:15'
  | '14:30'
  | '14:45'
  | '15:00'
  | '15:15'
  | '15:30'
  | '15:45'
  | '16:00'
  | '16:15'
  | '16:30'
  | '16:45'
  | '17:00'
  | '17:15'
  | '17:30'
  | '17:45'
  | '18:00'
  | '18:15'
  | '18:30'
  | '18:45'
  | '19:00'
  | '19:15'
  | '19:30'
  | '19:45'
  | '20:00'
  | '20:15'
  | '20:30'
  | '20:45'
  | '21:00'
  | '21:15'
  | '21:30'
  | '21:45'
  | '22:00'
  | '22:15'
  | '22:30'
  | '22:45'
  | '23:00'
  | '23:15'
  | '23:30'
  | '23:45'
  | '23:59'; // Open end