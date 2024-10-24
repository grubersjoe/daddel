import { logEvent } from 'firebase/analytics';
import { User } from 'firebase/auth';
import { Timestamp, updateDoc } from 'firebase/firestore';

import { GA_EVENTS } from '../constants';
import { Match, Player } from '../types';
import { analytics, auth } from './firebase';
import { getMatchRef, getUserRef } from './firestore';

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

  return updateDoc(getMatchRef(match.id), updatedMatch).then(() => {
    logEvent(analytics, GA_EVENTS.JOIN_MATCH);
  });
}

export function leaveMatch(user: User, match: Match): Promise<void> {
  const updatedMatch: Pick<Match, 'players'> = {
    players: match.players.filter(player => player.uid !== user.uid),
  };

  return updateDoc(getMatchRef(match.id), updatedMatch).then(() => {
    logEvent(analytics, GA_EVENTS.LEAVE_MATCH);
  });
}

export function toggleMatchReaction(match: Match, emoji: string) {
  const { currentUser } = auth;

  if (!currentUser) {
    return Promise.reject(new Error('No authenticated user'));
  }

  if (match.reactions === undefined) {
    match.reactions = [];
  }

  const currentUserRefs =
    match.reactions.find(reaction => reaction.emoji === emoji)?.userRefs ?? [];

  const shouldAppend = currentUserRefs.length === 0;
  const shouldRemoveReaction = currentUserRefs.some(
    userRef => userRef.id === currentUser.uid,
  );

  const updatedUserRefs = shouldRemoveReaction
    ? currentUserRefs.filter(userRef => userRef.id !== currentUser.uid)
    : currentUserRefs.concat(getUserRef(currentUser.uid));

  const updatedReaction = { emoji, userRefs: updatedUserRefs };

  const updatedReactions = shouldAppend
    ? match.reactions.concat(updatedReaction)
    : match.reactions
        .map(reaction =>
          reaction.emoji === emoji ? updatedReaction : reaction,
        )
        .filter(({ userRefs }) => userRefs.length > 0);

  return updateDoc(getMatchRef(match.id), {
    reactions: updatedReactions,
  });
}
