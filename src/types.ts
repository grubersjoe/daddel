export type Timestamp = firebase.firestore.Timestamp;

export type Match = {
  id?: string;
  date: Timestamp;
  players: Array<Player>;
  maxPlayers: number;
  description?: string;
  created: Timestamp;
  createdBy: string;
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

export type UserList = Map<User['uid'], User>;

export type QuerySnapshot = firebase.firestore.QuerySnapshot<
  firebase.firestore.DocumentData
>;
