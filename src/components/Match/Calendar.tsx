import { Box, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { differenceInMinutes } from 'date-fns';
import React, { FunctionComponent, ReactElement } from 'react';

import { FIFTEEN_MINUTES, MATCH_TIME_OPEN_END } from '../../constants/date';
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    time: {
      marginLeft: '0.75em',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',

      [theme.breakpoints.down(300)]: {
        display: 'none',
      },
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

interface BarProps {
  children: Array<ReactElement> | ReactElement;
  left: number;
  width: number;
}

const Bar: FunctionComponent<BarProps> = ({ left, width, children }) => (
  <Box
    sx={{
      ...styles(useTheme()).bar,
      ...{
        left: `${left}%`,
        width: `${width}%`,
      },
    }}
  >
    {children}
  </Box>
);

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
        const untilLabel = formatTime(player.until);

        return (
          <Bar width={width} left={left} key={player.uid}>
            <Box component="span">{users[player.uid]?.nickname}</Box>
            <Box component="span" sx={sx.time}>
              {formatTime(player.from)} –{' '}
              {untilLabel === MATCH_TIME_OPEN_END ? 'Open end' : untilLabel}
            </Box>
          </Bar>
        );
      })}
    </Box>
  );
};

export default Calendar;
