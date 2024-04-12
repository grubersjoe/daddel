import { Box, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { ReactElement, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { styles } from './styles';

export const TimeRange = ({
  width,
  offset,
  name,
  time,
}: {
  width: number;
  offset: number;
  name: string;
  time: ReactElement;
}) => {
  const sx = styles(useTheme());
  const [isToggled, setIsToggled] = useState(false);

  return (
    <Box
      onClick={() => setIsToggled(prev => !prev)}
      sx={{
        ...sx.bar,
        ...sx.textOverflow,
        ...{
          width: `${width}%`,
          left: `${offset}%`,
        },
        userSelect: 'none',
      }}
    >
      <TransitionGroup>
        <Fade key={isToggled ? 'time' : 'name'} timeout={180}>
          {isToggled ? time : <span>{name}</span>}
        </Fade>
      </TransitionGroup>
    </Box>
  );
};
