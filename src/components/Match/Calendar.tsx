import { Box, Fade, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { differenceInMinutes } from 'date-fns';
import React, { FunctionComponent, ReactElement, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { FIFTEEN_MINUTES } from '../../constants/date';
import useUsers from '../../hooks/useUsers';
import { Player } from '../../types';
import {
  formatTime,
  isOpenEndDate,
  timeStringsBetweenDates,
} from '../../utils/date';
import { calendarTimeBounds } from '../../utils/match';

type Props = {
  players: Array<Player>;
};

const styles = (theme: Theme) =>
  ({
    root: {
      position: 'relative',
      pt: 3.5, // space for legend
      fontSize: theme.typography.pxToRem(14),
    },
    label: {
      position: 'absolute',
      top: 0,
      height: '100%',
      borderLeft: 'solid 1px rgba(255, 255, 255, 0.2)',
      paddingLeft: '0.45em',
      lineHeight: 1,
    },
    bar: {
      position: 'relative',
      top: 0,
      height: 28, // a round number is preferable here (Skeleton)
      marginBottom: '7px',
      padding: '0.25em 0.75em',
      color: theme.palette.getContrastText(theme.palette.grey[300]),
      backgroundColor: theme.palette.grey[300],
      borderRadius: '4px',

      [theme.breakpoints.up('lg')]: {
        marginBottom: '8px',
      },
    },
    textOverflow: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }) as const;

interface LabelProps {
  children: ReactElement | string;
  left: number;
}

const Label: FunctionComponent<LabelProps> = ({ left, children }) => (
  <Box
    sx={{
      ...styles(useTheme()).label,
      ...{ left: `${left}%` },
    }}
  >
    {children}
  </Box>
);

const CalendarBar = ({
  left,
  width,
  name,
  time,
}: {
  left: number;
  width: number;
  name: ReactElement;
  time: ReactElement;
}) => {
  const sx = styles(useTheme());
  const delay = 400; // ms
  const [delayHandler, setDelayHandler] = useState<number>();
  const [isToggled, setIsToggled] = useState(false);

  return (
    <Box
      onTouchStart={() => setIsToggled(prev => !prev)}
      onMouseEnter={() => {
        if (delayHandler === undefined) {
          setDelayHandler(
            window.setTimeout(() => {
              setIsToggled(true);
            }, delay),
          );
        }
      }}
      onMouseLeave={() => {
        clearTimeout(delayHandler);
        setDelayHandler(undefined);
        setIsToggled(false);
      }}
      sx={{
        ...sx.bar,
        ...sx.textOverflow,
        ...{
          left: `${left}%`,
          width: `${width}%`,
        },
      }}
    >
      <TransitionGroup>
        <Fade key={isToggled ? 'time' : 'name'} timeout={200} appear={false}>
          {isToggled ? time : name}
        </Fade>
      </TransitionGroup>
    </Box>
  );
};

const Calendar: FunctionComponent<Props> = ({ players }) => {
  const [users] = useUsers();

  const theme = useTheme();
  const sx = styles(theme);

  if (players.length === 0) {
    return (
      <Typography color="textSecondary" sx={{ mb: 1 }}>
        Keine Mitspieler bisher
      </Typography>
    );
  }

  const timeBounds = calendarTimeBounds(players);
  const totalMinutes = differenceInMinutes(timeBounds.max, timeBounds.min);

  const numLabels = 4;
  const labelStepSize =
    Math.round(totalMinutes / numLabels / FIFTEEN_MINUTES) * FIFTEEN_MINUTES;

  const timeLabels = timeStringsBetweenDates(
    timeBounds.min,
    timeBounds.max,
    labelStepSize,
  );

  return (
    <Box sx={sx.root}>
      {timeLabels.map((label, index) => {
        const left = ((index * labelStepSize) / totalMinutes) * 100;
        return (
          // More than about 88% left will run outside of container
          left <= 88 && (
            <Label left={left} key={left}>
              {label}
            </Label>
          )
        );
      })}
      {players.map(player => {
        const minuteStart = differenceInMinutes(
          player.from.toDate(),
          timeBounds.min,
        );
        const minuteEnd = differenceInMinutes(
          isOpenEndDate(player.until) ? timeBounds.max : player.until.toDate(),
          timeBounds.min,
        );

        const width = ((minuteEnd - minuteStart) / totalMinutes) * 100;
        const left = (minuteStart / totalMinutes) * 100;

        const name = <span>{users[player.uid]?.nickname ?? 'Unbekannt'}</span>;
        const time = (
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            gap="0.5em"
          >
            <Box component="span">{formatTime(player.from)}</Box>
            <Box component="span" sx={{ ...sx.textOverflow }}>
              {isOpenEndDate(player.until) ? '∞' : formatTime(player.until)}
            </Box>
          </Box>
        );

        return (
          <CalendarBar
            width={width}
            left={left}
            key={player.uid}
            name={name}
            time={time}
          />
        );
      })}
    </Box>
  );
};

export default Calendar;
