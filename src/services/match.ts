import { logEvent } from 'firebase/analytics';
import { Timestamp, updateDoc } from 'firebase/firestore';

import { GA_EVENTS } from '../constants';
import { Match, Player } from '../types';
import { getCurrentUserId } from './auth';
import { analytics, getDocRef } from './firebase';

export function joinMatch(
  availFrom: Date,
  availUntil: Date,
  match: Match,
): Promise<void> {
  const updatedPlayer: Player = {
    uid: getCurrentUserId(),
    from: Timestamp.fromDate(availFrom),
    until: Timestamp.fromDate(availUntil),
  };

  const indexToUpdate = match.players.findIndex(
    player => player.uid === getCurrentUserId(),
  );

  const playerAlreadyJoined = indexToUpdate !== -1;

  const updatedMatch: Pick<Match, 'players'> = {
    players: playerAlreadyJoined
      ? match.players.map((player, index) =>
          index === indexToUpdate ? updatedPlayer : player,
        )
      : match.players.concat(updatedPlayer),
  };

  return updateDoc(getDocRef<Match>('matches', match.id), updatedMatch).then(
    () => logEvent(analytics, GA_EVENTS.JOIN_MATCH),
  );
}

export function leaveMatch(match: Match): Promise<void> {
  const updatedMatch: Pick<Match, 'players'> = {
    players: match.players.filter(player => player.uid !== getCurrentUserId()),
  };

  return updateDoc(getDocRef<Match>('matches', match.id), updatedMatch).then(
    () => logEvent(analytics, GA_EVENTS.LEAVE_MATCH),
  );
}
