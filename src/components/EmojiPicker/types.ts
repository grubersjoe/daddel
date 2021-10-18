export type CategoryName =
  | 'Frequently Used'
  | 'Smileys & People'
  | 'Animals & Nature'
  | 'Food & Drink'
  | 'Activity'
  | 'Travel & Places'
  | 'Objects'
  | 'Symbols'
  | 'Flags';

export type Emoji = [emoji: string, description: string];

export type EmojiList = Array<{
  category: CategoryName;
  emojis: Array<Emoji>;
}>;
