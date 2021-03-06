import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import fromUnixTime from 'date-fns/fromUnixTime';
import Typography from '@material-ui/core/Typography';

import { Player, UserMap } from '../../types';
import {
  calcTimeStringsBetweenDates,
  formatTime,
  isOpenEndDate,
} from '../../utils/date';
import { calcPlayerTimeBounds } from '../../utils/match';
import {
  DEFAULT_TIME_INCREMENT,
  MATCH_TIME_OPEN_END,
} from '../../constants/date';

type Props = {
  players: Array<Player>;
  userList: UserMap;
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    marginTop: theme.spacing(2.5),
    paddingTop: theme.spacing(3.5), // space for legend
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
    marginBottom: 7,
    padding: '0.25em 0.75em',
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    backgroundColor: theme.palette.grey[300],
    borderRadius: 3,

    [theme.breakpoints.up('lg')]: {
      marginBottom: 8,
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
}));

const Label: React.FC<{ left: number }> = ({ left, children }) => (
  <div className={useStyles().label} style={{ left: `${left}%` }}>
    {children}
  </div>
);

const Bar: React.FC<{ left: number; width: number }> = ({
  left,
  width,
  children,
}) => (
  <div
    className={useStyles().bar}
    style={{ left: `${left}%`, width: `${width}%` }}
  >
    {children}
  </div>
);

const Calendar: React.FC<Props> = ({ players, userList }) => {
  const classes = useStyles();
  const theme = useTheme();

  if (players.length === 0) {
    return (
      <Typography
        color="textSecondary"
        style={{ marginBottom: theme.spacing(1) }}
      >
        Keine Mitspieler bisher
      </Typography>
    );
  }

  const timeBounds = calcPlayerTimeBounds(players);
  const minDate = fromUnixTime(timeBounds.min);
  const maxDate = fromUnixTime(
    timeBounds.withOpenEnd
      ? timeBounds.max + DEFAULT_TIME_INCREMENT * 60
      : timeBounds.max,
  );
  const totalMinutes = differenceInMinutes(maxDate, minDate);

  const labelStepSize =
    Math.round(totalMinutes / 4 / DEFAULT_TIME_INCREMENT) *
    DEFAULT_TIME_INCREMENT;

  const timeLabels = calcTimeStringsBetweenDates(
    minDate,
    maxDate,
    labelStepSize,
  );

  const playerTimeIntervals = players.map(player => ({
    minuteStart: differenceInMinutes(player.from.toDate(), minDate),
    minuteEnd: differenceInMinutes(
      isOpenEndDate(player.until) ? maxDate : player.until.toDate(),
      minDate,
    ),
  }));

  return (
    <div className={classes.root}>
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
      {players.map((player, index) => {
        const { minuteEnd, minuteStart } = playerTimeIntervals[index];
        const width = ((minuteEnd - minuteStart) / totalMinutes) * 100;
        const left = (minuteStart / totalMinutes) * 100;

        const untilLabel = formatTime(player.until);

        return (
          <Bar width={width} left={left} key={player.uid}>
            <span>{userList.get(player.uid)?.nickname}</span>
            <span className={classes.time}>
              {formatTime(player.from)} –{' '}
              {untilLabel === MATCH_TIME_OPEN_END ? 'Open end' : untilLabel}
            </span>
          </Bar>
        );
      })}
    </div>
  );
};

export default Calendar;
