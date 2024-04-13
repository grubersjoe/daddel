import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ChangeEventHandler,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { InView } from 'react-intersection-observer';

import CategoryNav from './CategoryNav';
import Grid, { Props as GridProps } from './Grid';
import Preview from './Preview';
import SearchBar from './SearchBar';
import useFilteredEmojiList from './hooks/useFilteredEmojiList';
import './styles/index.scss';
import { CategoryName, Emoji } from './types';
import { getRecentlyUsedEmojis, incrementEmojiUsage } from './utils/usage';

export const BUTTON_SIZE = 34; // px
export const GRID_GAP = 2 * Math.round((BUTTON_SIZE * 0.3) / 2); // px
export const MIN_SEARCH_LENGTH = 2; // characters
export const NUM_COLUMNS = 8;

const calcContainerWidth = () => {
  const containerPadding = 2 * 16;

  return (BUTTON_SIZE + GRID_GAP) * NUM_COLUMNS + containerPadding;
};

const ScrollContainer = styled('div')(({ theme }) => ({
  maxHeight: '100%',
  height: 280,
  overflow: 'auto',
  paddingLeft: 16,
  paddingRight: 16,

  [theme.breakpoints.up('sm')]: {
    paddingRight: 0,
  },
}));

const Picker = ({
  onEmojiClick: onEmojiClickProp,
}: {
  onEmojiClick: (emoji: Emoji) => void;
}) => {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const [activeEmoji, setActiveEmoji] = useState<Emoji | null>(null);

  const [activeCategory, setActiveCategory] =
    useState<CategoryName>('Frequently Used');

  const [searchTerm, setSearchTerm] = useState('');
  const filterActive = searchTerm.length >= MIN_SEARCH_LENGTH;

  const numberOfShownUsedEmojis = NUM_COLUMNS * 2;
  const [usedEmojis, setUsedEmojis] = useState<Array<Emoji>>(
    getRecentlyUsedEmojis(numberOfShownUsedEmojis),
  );

  const filteredEmojiList = useFilteredEmojiList(searchTerm, usedEmojis);
  const numberOfShownEmojis = filteredEmojiList.reduce(
    (sum, { emojis }) => sum + emojis.length,
    0,
  );

  const theme = useTheme();
  const xsView = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!searchTerm) {
      setActiveCategory('Frequently Used');
    }
  }, [searchTerm]);

  const onSearch = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => setSearchTerm(event.target.value.trim().toLowerCase()),
    [],
  );

  const onClearSearch = useCallback(() => setSearchTerm(''), []);

  const onEmojiClick = useCallback<GridProps['onEmojiClick']>(
    (emoji, category) => {
      onEmojiClickProp(emoji);

      if (category !== 'Frequently Used') {
        incrementEmojiUsage(emoji);
        setUsedEmojis(getRecentlyUsedEmojis(numberOfShownUsedEmojis));
      }
    },
    [onEmojiClickProp, numberOfShownUsedEmojis],
  );

  const onEmojiMouseEnter = useCallback<GridProps['onEmojiMouseEnter']>(
    emoji => setActiveEmoji(emoji),
    [],
  );

  const handleScrollChange =
    (category: CategoryName) =>
    (inView: boolean, entry: IntersectionObserverEntry) => {
      if (inView) {
        if (category === activeCategory) {
          return;
        }

        const tallerThanViewport =
          entry.rootBounds &&
          entry.rootBounds.height < entry.boundingClientRect.height;

        // An intersection ratio of 1 means, that the element is *completely*
        // visible within the root container. So, elements taller than the
        // viewport will never meet this condition.
        if (tallerThanViewport || entry.intersectionRatio === 1) {
          setActiveCategory(category);
        }
      }
    };

  return (
    <Box
      sx={{
        width: xsView ? '100%' : calcContainerWidth(),
        maxWidth: '100%',
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.700',
        overflow: 'hidden',
      }}
    >
      <CategoryNav active={filterActive ? undefined : activeCategory} />
      <SearchBar
        searchTerm={searchTerm}
        onChange={onSearch}
        onClearInput={onClearSearch}
      />
      <ScrollContainer
        ref={el => setScrollElement(el)}
        onMouseLeave={() => setActiveEmoji(null)}
      >
        {scrollElement &&
          (numberOfShownEmojis > 0 ? (
            filteredEmojiList.map(({ category, emojis }) => (
              <InView
                root={scrollElement}
                rootMargin={`0px 0px -${BUTTON_SIZE * 2}px 0px`}
                threshold={[0.05, 1]}
                onChange={(inView, entry) =>
                  handleScrollChange(category)(inView, entry)
                }
                key={category}
              >
                <Grid
                  category={category}
                  emojis={emojis}
                  onEmojiClick={onEmojiClick}
                  onEmojiMouseEnter={onEmojiMouseEnter}
                />
              </InView>
            ))
          ) : (
            <Box py={4} pr={2}>
              <Typography align="center" sx={{ mb: 0.5, fontSize: '2.5rem' }}>
                🕵️
              </Typography>
              <Typography align="center" color="grey.500">
                No Emoji found
              </Typography>
            </Box>
          ))}
      </ScrollContainer>
      <Preview emoji={activeEmoji} />
    </Box>
  );
};
export default memo(Picker);
