import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { differenceInMinutes } from 'date-fns';

import { DEFAULT_TIME_INCREMENT_MINUTES } from '../../../constants/date';
import useUsers from '../../../hooks/useUsers';
import { Player } from '../../../types';
import {
  formatTime,
  isOpenEndDate,
  timeStringsBetweenDates,
} from '../../../utils/date';
import { calendarTimeBounds } from '../../../utils/match';
import { TimeLabel } from './TimeLabel';
import { TimeRange } from './TimeRange';
import { styles } from './styles';

const Calendar = ({ players }: { players: Array<Player> }) => {
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

  const numLabels = 5;
  const stepSizeMinutes =
    Math.round(totalMinutes / numLabels / DEFAULT_TIME_INCREMENT_MINUTES) *
    DEFAULT_TIME_INCREMENT_MINUTES;

  const timeLabels = timeStringsBetweenDates(
    timeBounds.min,
    timeBounds.max,
    stepSizeMinutes,
  );

  return (
    <Box sx={sx.root}>
      {timeLabels.map((label, index) => {
        const left = ((index * stepSizeMinutes) / totalMinutes) * 100;
        return (
          // More than about 88% left will run outside of container
          left <= 88 && (
            <TimeLabel left={left} key={left}>
              {label}
            </TimeLabel>
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

        const width = ((minuteEnd - minuteStart) / totalMinutes) * 100; // %
        const offset = (minuteStart / totalMinutes) * 100; // %

        const time = (
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            gap="0.5em"
          >
            <Box component="span">{formatTime(player.from)}</Box>
            <Box component="span" sx={{ ...sx.textOverflow }}>
              {isOpenEndDate(player.until)
                ? 'Open End'
                : formatTime(player.until)}
            </Box>
          </Box>
        );

        return (
          <TimeRange
            key={player.uid}
            width={width}
            offset={offset}
            name={users[player.uid]?.nickname ?? ''}
            time={time}
          />
        );
      })}
    </Box>
  );
};

export default Calendar;
