export type Timestamp = firebase.firestore.Timestamp;

export type Match = {
  id?: string;
  date: Timestamp;
  players: Array<{
    from: Timestamp;
    until: Timestamp;
    uid: string;
  }>;
  maxPlayers: number;
  description?: string;
  created: Timestamp;
  createdBy: string;
};

export type User = {
  uid: string;
  nickname: string;
};

export type UserList = Map<User['uid'], User>;

export type QuerySnapshot = firebase.firestore.QuerySnapshot<
  firebase.firestore.DocumentData
>;
