import parse from 'date-fns/parse';

import firebase from './firebase';
import { TIME_FORMAT } from '../constants/time';
import { Match } from '../types';

export function joinMatch(args: {
  availFrom: string;
  availUntil: string;
  matchId: string;
}): Promise<void> {
  const { currentUser } = firebase.auth;
  if (!currentUser) throw new Error('No current user');

  const backup = new Date();
  const matchData: Pick<Match, 'players'> = {
    players: [
      {
        from: firebase.timestamp(parse(args.availFrom, TIME_FORMAT, backup)),
        until: firebase.timestamp(parse(args.availUntil, TIME_FORMAT, backup)),
        uid: currentUser.uid,
      },
    ],
  };

  return firebase.firestore
    .collection('matches')
    .doc(args.matchId)
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
