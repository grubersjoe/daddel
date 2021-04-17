import { EVENTS } from '../constants';
import { Match, Player } from '../types';
import firebase from './firebase';

export function joinMatch(availFrom: Date, availUntil: Date, match: Match) {
  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  const updatedPlayer: Player = {
    uid: currentUser.uid,
    from: firebase.getTimestamp(availFrom),
    until: firebase.getTimestamp(availUntil),
  };

  // Check if player is already in lobby
  const indexToUpdate = match.players.findIndex(
    player => player.uid === currentUser.uid,
  );

  const matchData: Pick<Match, 'players'> = {
    players:
      indexToUpdate === -1
        ? match.players.concat(updatedPlayer)
        : match.players.map((player, index) =>
            index === indexToUpdate ? updatedPlayer : player,
          ),
  };

  return firebase.firestore
    .collection('matches')
    .doc(match.id)
    .update(matchData)
    .then(() => firebase.analytics.logEvent(EVENTS.JOIN_MATCH));
}

export function leaveMatch(match: Match) {
  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  return firebase.firestore
    .collection('matches')
    .doc(match.id)
    .update({
      players: match.players.filter(player => player.uid !== currentUser.uid),
    })
    .then(() => firebase.analytics.logEvent(EVENTS.LEAVE_MATCH));
}
