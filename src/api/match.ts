import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import parse from 'date-fns/parse';

import firebase from './firebase';
import { TIME_FORMAT } from '../constants/time';
import { Match, Player } from '../types';

export function joinMatch(args: {
  availFrom: string;
  availUntil: string;
  match: Required<Match>;
  currentPlayers: Player[];
}): Promise<void> {
  const { currentUser } = firebase.auth;
  const { availFrom, availUntil, match, currentPlayers } = args;

  if (!currentUser) throw new Error('No current user');

  const matchDate = format(fromUnixTime(match.date.seconds), 'yyyy-MM-dd');
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
  const index = currentPlayers.findIndex(
    player => player.uid === currentUser.uid,
  );

  let matchData: Pick<Match, 'players'> = { players: [] };

  // No match
  if (index === -1) {
    matchData.players = [...currentPlayers, updatedPlayer];
  } else {
    currentPlayers[index] = updatedPlayer;
    matchData.players = currentPlayers;
  }

  return firebase.firestore
    .collection('matches')
    .doc(match.id)
    .set(matchData, { merge: true });
}

export function leaveMatch(args: {
  players: Match['players'];
  matchId: string;
}) {
  const { currentUser } = firebase.auth;
  if (!currentUser) throw new Error('No current user');

  // Yes this is stupid, but Firebase does not seem to support deleting  array
  // entries by nested object properties
  return firebase.firestore
    .collection('matches')
    .doc(args.matchId)
    .update({
      players: args.players.filter(player => player.uid !== currentUser.uid),
    });
}
