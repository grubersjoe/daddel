import { Box, Fade } from '@mui/material';
import { orange } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { ReactElement, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { styles } from './styles';

interface Props {
  width: number;
  offset: number;
  name: string;
  time: ReactElement;
  exceedsLobby: boolean;
}

export const TimeRange = ({
  width,
  offset,
  name,
  time,
  exceedsLobby,
}: Props) => {
  const theme = useTheme();
  const sx = styles(theme);
  const [isToggled, setIsToggled] = useState(false);

  return (
    <Box
      onClick={() => {
        setIsToggled(prev => !prev);
      }}
      sx={{
        ...sx.bar,
        ...sx.textOverflow,
        ...{
          width: `${width}%`,
          left: `${offset}%`,
        },
        ...(exceedsLobby && {
          backgroundColor: orange[200],
        }),
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
