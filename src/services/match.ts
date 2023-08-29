import { logEvent } from 'firebase/analytics';
import { User } from 'firebase/auth';
import { Timestamp, updateDoc } from 'firebase/firestore';

import { GA_EVENTS } from '../constants';
import { Match, Player } from '../types';
import { analytics } from './firebase';
import { getMatchRef } from './firestore';

export function joinMatch(
  user: User,
  availFrom: Date,
  availUntil: Date,
  match: Match,
): Promise<void> {
  const updatedPlayer: Player = {
    uid: user.uid,
    from: Timestamp.fromDate(availFrom),
    until: Timestamp.fromDate(availUntil),
  };

  const indexToUpdate = match.players.findIndex(
    player => player.uid === user.uid,
  );

  const playerAlreadyJoined = indexToUpdate !== -1;

  const updatedMatch: Pick<Match, 'players'> = {
    players: playerAlreadyJoined
      ? match.players.map((player, index) =>
          index === indexToUpdate ? updatedPlayer : player,
        )
      : match.players.concat(updatedPlayer),
  };

  return updateDoc(getMatchRef(match.id), updatedMatch).then(() =>
    logEvent(analytics, GA_EVENTS.JOIN_MATCH),
  );
}

export function leaveMatch(user: User, match: Match): Promise<void> {
  const updatedMatch: Pick<Match, 'players'> = {
    players: match.players.filter(player => player.uid !== user.uid),
  };

  return updateDoc(getMatchRef(match.id), updatedMatch).then(() =>
    logEvent(analytics, GA_EVENTS.LEAVE_MATCH),
  );
}
