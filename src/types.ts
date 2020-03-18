export type Timestamp = firebase.firestore.Timestamp;

export type GameID = 'csgo' | 'tabletopSimulator';

export type Game = {
  id: GameID;
  maxPlayers?: number;
  name: string;
};

export type Match = {
  id?: string;
  created: Timestamp;
  createdBy: string;
  date: Timestamp;
  description?: string;
  game?: GameID; // introduced later
  maxPlayers?: number;
  players: Array<Player>;
};

export type Player = {
  uid: string;
  from: Timestamp;
  until: Timestamp;
};

export type User = {
  uid: string;
  nickname: string;
};

export type UserMap = Map<User['uid'], User>;

export type QuerySnapshot = firebase.firestore.QuerySnapshot<
  firebase.firestore.DocumentData
>;
