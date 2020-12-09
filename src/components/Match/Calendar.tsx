import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import fromUnixTime from 'date-fns/fromUnixTime';

import { Player, UserMap } from '../../types';
import {
  calcTimeLabelsBetweenDates,
  formatTimestamp,
  isOpenEndTimestamp,
} from '../../utils/date';
import {
  DEFAULT_TIME_INCREMENT,
  MATCH_TIME_OPEN_END,
} from '../../constants/date';

type Props = {
  players: Player[];
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
    borderLeft: 'solid 1px rgba(255, 255, 255, 0.3)',
    paddingLeft: '0.4em',
    lineHeight: 1,
  },
  bar: {
    position: 'relative',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5em',
    padding: '0.25em 0.75em',
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    backgroundColor: theme.palette.grey[300],
    borderRadius: 3,

    [theme.breakpoints.up('lg')]: {
      marginBottom: '0.55em',
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

  const timeBounds = players.reduce(
    (bounds, player) => {
      // Do not enlarge time bounds for open end timestamps
      if (isOpenEndTimestamp(player.until)) {
        return {
          min: Math.min(bounds.min, player.from.seconds),
          max: bounds.max,
          withOpenEnd: true,
        };
      }

      return {
        min: Math.min(bounds.min, player.from.seconds),
        max: Math.max(bounds.max, player.until.seconds),
        withOpenEnd: bounds.withOpenEnd,
      };
    },
    { min: Infinity, max: -Infinity, withOpenEnd: false },
  );

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

  const timeLabels = calcTimeLabelsBetweenDates(
    minDate,
    maxDate,
    labelStepSize,
  );

  const playerTimeIntervals = players.map(player => ({
    minuteStart: differenceInMinutes(
      fromUnixTime(player.from.seconds),
      minDate,
    ),
    minuteEnd: differenceInMinutes(
      isOpenEndTimestamp(player.until)
        ? maxDate
        : fromUnixTime(player.until.seconds),
      minDate,
    ),
  }));

  return (
    <div className={classes.root}>
      {timeLabels.map((timeLabel, index) => {
        const left = ((index * labelStepSize) / totalMinutes) * 100;
        return (
          // More than about 88% left will run outside of container
          left <= 88 && (
            <Label left={left} key={left}>
              {timeLabel}
            </Label>
          )
        );
      })}
      {players.map((player, index) => {
        const { minuteEnd, minuteStart } = playerTimeIntervals[index];
        const width = ((minuteEnd - minuteStart) / totalMinutes) * 100;
        const left = (minuteStart / totalMinutes) * 100;

        const untilLabel = formatTimestamp(player.until);

        return (
          <Bar width={width} left={left} key={player.uid}>
            <span>{userList.get(player.uid)?.nickname}</span>
            <span className={classes.time}>
              {formatTimestamp(player.from)} –{' '}
              {untilLabel === MATCH_TIME_OPEN_END ? 'Open end' : untilLabel}
            </span>
          </Bar>
        );
      })}
    </div>
  );
};

export default Calendar;
