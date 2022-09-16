import { Box, Typography } from '@mui/material';
import React, { FunctionComponent, memo } from 'react';

import { BUTTON_SIZE } from './Picker';
import { CategoryName, Emoji } from './types';
import { getCategoryContainerId } from './utils';

export interface Props {
  category: CategoryName;
  emojis: Array<Emoji>;
  onEmojiClick: (emoji: Emoji, category: CategoryName) => void;
  onEmojiMouseEnter: (emoji: Emoji) => void;
}

const Grid: FunctionComponent<Props> = ({
  category,
  emojis,
  onEmojiClick,
  onEmojiMouseEnter,
}) => {
  if (emojis.length === 0) {
    return null;
  }

  const getFontSize = (factor: number) =>
    2 * Math.round((BUTTON_SIZE * factor) / 2);

  return (
    <Box mb={3} id={getCategoryContainerId(category)}>
      <Box mb={1}>
        <Typography variant="subtitle2">{category}</Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          // min-content does not work together with auto-fit, unfortunately
          gridTemplateColumns: `repeat(auto-fit, ${BUTTON_SIZE}px)`,
          gridAutoRows: BUTTON_SIZE,
          // 10% rounded to the nearest even integer
          gridGap: `${2 * Math.round((BUTTON_SIZE * 0.2) / 2)}px`,
          fontSize: getFontSize(0.8),

          '@media (min-width: 600px)': {
            fontSize: getFontSize(0.7),
          },
        }}
      >
        {emojis.map(([emoji, description]) => (
          <button
            className="emoji-button"
            onClick={() => onEmojiClick([emoji, description], category)}
            onMouseEnter={() => onEmojiMouseEnter([emoji, description])}
            key={description}
          >
            {emoji}
          </button>
        ))}
      </Box>
    </Box>
  );
};

export default memo(Grid);
