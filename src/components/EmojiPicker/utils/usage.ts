import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEY,
} from '../../../utils/local-storage';

import { Emoji, EmojiList } from '../types';
import emojiList from '../assets/emojis-v13.1.json';

export type UsageDict = {
  [emoji: string]: number;
};

const DEFAULT_LIST = ['👍', '💩'];

export function getRecentlyUsedEmojis(max = 10): Array<Emoji> {
  const usedEmojis = getUsedEmojisFromStore();

  if (Object.entries(usedEmojis).length === 0) {
    return getEmojis(DEFAULT_LIST.slice(0, max));
  }

  const sorted = Object.entries(usedEmojis)
    .sort(([, v1], [, v2]) => v2 - v1)
    .map(([emoji]) => emoji)
    .slice(0, max);

  return getEmojis(sorted);
}

export function incrementEmojiUsage([emoji]: Emoji) {
  const usedEmojis = getUsedEmojisFromStore();

  if (typeof usedEmojis[emoji] !== 'number') {
    usedEmojis[emoji] = 0;
  }

  usedEmojis[emoji] += 1;
  setStorageItem(STORAGE_KEY.FREQUENTLY_USED_EMOJIS, usedEmojis);
}

export function getEmojis(chars: Array<string>): Array<Emoji> {
  const allEmojis = (emojiList as EmojiList).flatMap(({ emojis }) => emojis);

  return chars
    .map(char => allEmojis.find(([emoji]) => emoji === char))
    .filter(Boolean) as Array<Emoji>;
}

function getUsedEmojisFromStore(): UsageDict {
  return getStorageItem<UsageDict>(STORAGE_KEY.FREQUENTLY_USED_EMOJIS) ?? {};
}
