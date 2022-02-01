import { DEFAULT_LIST, getEmojis, getRecentlyUsedEmojis } from './usage';

describe('getEmojis()', () => {
  test('should return correct list of tuples from Emoji JSON', () => {
    expect(getEmojis(['💗', '🍪'])).toStrictEqual([
      ['💗', 'growing heart', 'heartpulse'],
      ['🍪', 'cookie', 'cookie'],
    ]);
  });
});

describe('getRecentlyUsedEmojis()', () => {
  test('should return default Emoji list for empty local storage', () => {
    expect(getRecentlyUsedEmojis(10)).toStrictEqual(
      getEmojis(DEFAULT_LIST.slice(0, 10)),
    );
  });

  test('should return correctly sorted Emoji list according to usage', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation(() =>
      JSON.stringify({
        '🥰': 5,
        '😎': 0,
        '🤭': 2,
        '🥺': 2,
        '🥳': 3,
      }),
    );

    expect(getRecentlyUsedEmojis(10)).toStrictEqual(
      getEmojis(
        ['🥰', '🥳', '🤭', '🥺', '😎'].concat(DEFAULT_LIST.slice(0, 5)),
      ),
    );
  });

  test('should return at most n sorted Emojis', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation(() =>
      JSON.stringify({
        '🥰': 5,
        '😎': 0,
        '🤭': 2,
        '🥺': 2,
        '🥳': 3,
      }),
    );

    expect(getRecentlyUsedEmojis(3)).toStrictEqual(
      getEmojis(['🥰', '🥳', '🤭']),
    );
  });
});
