import fromUnixTime from 'date-fns/fromUnixTime';
import parse from 'date-fns/parse';

import firebase from './firebase';
import { TimeLabel, Match, Player } from '../types';
import { TIME_FORMAT } from '../constants/date';
import { format } from '../utils/date';

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

  const matchDate = format(fromUnixTime(match.date.seconds), 'yyyy-MM-dd');

  try {
    const updatedPlayer: Player = {
      uid: currentUser.uid,
      from: firebase.timestamp(
        parse(
          `${matchDate} ${availFrom}`,
          `yyyy-MM-dd ${TIME_FORMAT}`,
          new Date(),
        ),
      ),
      until: firebase.timestamp(
        parse(
          `${matchDate} ${availUntil}`,
          `yyyy-MM-dd ${TIME_FORMAT}`,
          new Date(),
        ),
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
      // No match, so simply add the player
      matchData.players = [...match.players, updatedPlayer];
    } else {
      // Update current list of players
      matchData.players = match.players.map((player, index) => {
        if (index !== targetIndex) return player;
        return updatedPlayer;
      });
    }

    return firebase.firestore
      .collection('matches')
      .doc(match.id)
      .set(matchData, { merge: true });
  } catch (error) {
    return Promise.reject(error);
  }
}

export function leaveMatch(args: {
  players: Match['players'];
  matchId: string;
}) {
  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  // Yes this is stupid, but Firebase does not seem to support deleting  array
  // entries by nested object properties
  return firebase.firestore
    .collection('matches')
    .doc(args.matchId)
    .update({
      players: args.players.filter(player => player.uid !== currentUser.uid),
    });
}
