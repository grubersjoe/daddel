import React from 'react';
import { Box, Typography } from '@mui/material';

import { CategoryName, Emoji } from './types';
import { getCategoryContainerId } from './utils';
import { BUTTON_SIZE } from './Picker';

export interface Props {
  category: CategoryName;
  emojis: Array<Emoji>;
  onEmojiClick: (emoji: Emoji, category: CategoryName) => void;
  onEmojiMouseEnter: (emoji: Emoji) => void;
}

const Grid: React.FC<Props> = ({
  category,
  emojis,
  onEmojiClick,
  onEmojiMouseEnter,
}) => {
  if (emojis.length === 0) {
    return null;
  }

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
          fontSize: 2 * Math.round((BUTTON_SIZE * 0.75) / 2),
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

export default React.memo(Grid);
