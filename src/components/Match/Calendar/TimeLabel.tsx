import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { ReactElement } from 'react';

import { styles } from './styles';

interface Props {
  children: ReactElement | string;
  left: number;
}

export const TimeLabel = ({ left, children }: Props) => (
  <Box
    sx={{
      ...styles(useTheme()).timeLabel,
      ...{ left: `${left}%` },
    }}
  >
    {children}
  </Box>
);
