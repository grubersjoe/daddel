import { MIN_SEARCH_LENGTH } from '../Picker';
import emojiList from '../assets/emojis-v13.1.json';
import { Emoji, EmojiList } from '../types';

export default function useFilteredEmojiList(
  searchTerm: string,
  usedEmojis: Array<Emoji>,
): EmojiList {
  const frequentlyUsed = {
    category: 'Frequently Used',
    emojis: usedEmojis,
  } as const;

  return [frequentlyUsed, ...(emojiList as EmojiList)].map(
    ({ category, emojis }) => ({
      category,
      emojis:
        searchTerm.length >= MIN_SEARCH_LENGTH
          ? emojis.filter(([_, description]) =>
              description.toLowerCase().includes(searchTerm),
            )
          : emojis,
    }),
  );
}
