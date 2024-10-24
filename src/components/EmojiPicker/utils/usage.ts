import {
  STORAGE_KEY,
  getStorageItem,
  setStorageItem,
} from '../../../utils/local-storage';
import emojiList from '../assets/emojis-v13.1.json';
import { Emoji, EmojiList } from '../types';

export type UsageDict = {
  [emoji: string]: number;
};

export const DEFAULT_LIST = [
  '👍',
  '👎',
  '😍',
  '😄',
  '😜',
  '🥺',
  '😏',
  '🥴',
  '😲',
  '🤬',
  '🧐',
  '🤷',
  '🔥',
  '✨',
  '🐗',
  '💩',
];

const allEmojis = (emojiList as EmojiList).flatMap(({ emojis }) => emojis);

export function getRecentlyUsedEmojis(max = 10): Array<Emoji> {
  const usedEmojis = getUsedEmojisFromStore();

  const sorted = Object.entries(usedEmojis)
    .sort(([, v1], [, v2]) => v2 - v1)
    .map(([emoji]) => emoji)
    .slice(0, max);

  if (sorted.length < max) {
    // Set is used to remove duplicate Emojis
    const withDefaultEmojis = Array.from(
      new Set(sorted.concat(DEFAULT_LIST.slice(0, max - sorted.length))),
    );

    return getEmojis(withDefaultEmojis);
  }

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
  return chars
    .map(char => allEmojis.find(([emoji]) => emoji === char))
    .filter(Boolean) as Array<Emoji>;
}

function getUsedEmojisFromStore(): UsageDict {
  const dict = getStorageItem(STORAGE_KEY.FREQUENTLY_USED_EMOJIS) ?? {};
  return dict as UsageDict;
}
