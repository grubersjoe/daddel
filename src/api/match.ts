import parse from 'date-fns/parse';

import firebase from './firebase';
import { TIME_FORMAT } from '../constants/time';
import { Match, Player } from '../types';

export function joinMatch(args: {
  availFrom: string;
  availUntil: string;
  matchId: string;
  currentPlayers: Player[];
}): Promise<void> {
  const { currentUser } = firebase.auth;
  const { availFrom, availUntil, matchId, currentPlayers } = args;

  if (!currentUser) throw new Error('No current user');

  const now = new Date();
  const updatedPlayer: Player = {
    uid: currentUser.uid,
    from: firebase.timestamp(parse(availFrom, TIME_FORMAT, now)),
    until: firebase.timestamp(parse(availUntil, TIME_FORMAT, now)),
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
    .doc(matchId)
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
