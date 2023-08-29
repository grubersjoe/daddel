import { updateDoc } from 'firebase/firestore';

import { Match } from '../types';
import { auth } from './firebase';
import { getMatchRef, getUserRef } from './firestore';

export function toggleMatchReaction(match: Match, emoji: string) {
  const { currentUser } = auth;

  if (!currentUser) {
    return Promise.reject('No authenticated user');
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
