import { Box } from '@mui/material';
import { memo } from 'react';

import { Emoji } from './types';

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const Preview = ({ emoji: emojiProp }: { emoji: Emoji | null }) => {
  const [emoji, description] = emojiProp ?? [];

  return (
    <Box
      sx={{
        mt: 2,
        px: 2,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        borderTop: 1,
        borderColor: 'grey.700',
      }}
    >
      <Box fontSize="2rem">{emoji ?? '☝'}</Box>
      <Box ml={2}>
        {description ? capitalizeFirstLetter(description) : 'Pick an Emoji'}
      </Box>
    </Box>
  );
};

export default memo(Preview);
