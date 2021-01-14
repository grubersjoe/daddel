import { EVENTS } from '../constants';
import { TimeLabel, Match, Player } from '../types';
import { parseTimeLabel } from '../utils/date';
import firebase from './firebase';

/**
 * @throws Error
 */
export function joinMatch(
  availFrom: TimeLabel,
  availUntil: TimeLabel,
  match: Match,
): Promise<void> {
  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  try {
    const updatedPlayer: Player = {
      uid: currentUser.uid,
      from: firebase.getTimestamp(
        parseTimeLabel(availFrom, match.date.toDate()),
      ),
      until: firebase.getTimestamp(
        parseTimeLabel(availUntil, match.date.toDate()),
      ),
    };

    // Check if player is already in lobby
    const targetIndex = match.players.findIndex(
      player => player.uid === currentUser.uid,
    );

    let matchData: Pick<Match, 'players'> = {
      players: [],
    };

    if (targetIndex === -1) {
      // Not found, so simply add the player
      matchData.players = [...match.players, updatedPlayer];
    } else {
      // Update list of players otherwise
      matchData.players = match.players.map((player, index) =>
        index === targetIndex ? updatedPlayer : player,
      );
    }

    return firebase.firestore
      .collection('matches')
      .doc(match.id)
      .update(matchData)
      .then(() => firebase.analytics.logEvent(EVENTS.JOIN_MATCH));
  } catch (error) {
    return Promise.reject(error);
  }
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
