import React, { FunctionComponent, memo } from 'react';
import { Box } from '@mui/material';

import { capitalizeFirstLetter } from '../../utils';
import { Emoji } from './types';

interface Props {
  emoji: Emoji | null;
}

const Preview: FunctionComponent<Props> = ({ emoji: emojiProp }) => {
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
      <Box fontSize="2.25rem">{emoji ?? '☝'}</Box>
      <Box ml={2}>
        {description ? capitalizeFirstLetter(description) : 'Pick an Emoji'}
      </Box>
    </Box>
  );
};

export default memo(Preview);
