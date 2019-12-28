export type Match = {
  date: Date | Timestamp;
  players: string[];
  maxPlayers: number;
  description?: string;
  created: Date;
  createdBy: string;
};

export type Timestamp = {
  nanoseconds: number;
  seconds: number;
};
