import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';

import { TIME_FORMAT } from '../../constants/time';
import { Player, UserList } from '../../types';
import { formatTimestamp, calcTimeLabelsBetweenTimes } from '../../utils';

type Props = {
  players: Player[];
  userList: UserList;
};

type BarProps = {
  left: number; // in percent
  width: number; // in percent
};

type LabelProps = {
  left: number; // in percent
};

const textOverflow: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    paddingTop: theme.spacing(3.5),
    fontSize: '85%',
  },
  label: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderLeft: 'solid 1px rgba(255, 255, 255, 0.2)',
    paddingLeft: '0.4em',
    lineHeight: 1,
  },
  bar: {
    position: 'relative',
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
    padding: '0.2em 0.75em',
    backgroundColor: '#6E6E6E',
    borderRadius: 3,
    textShadow: `0 1px 0 ${theme.palette.grey[800]}`,
  },
  name: {
    ...textOverflow,
    fontWeight: 500,
  },
  time: {
    ...textOverflow,
    color: 'rgba(255, 255, 255, 0.9)',
  },
}));

const Label: React.FC<LabelProps> = ({ left, children }) => (
  <div className={useStyles().label} style={{ left: `${left}%` }}>
    {children}
  </div>
);

const Bar: React.FC<BarProps> = ({ left, width, children }) => (
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
      return {
        min: Math.min(bounds.min, player.from.seconds),
        max: Math.max(bounds.max, player.until.seconds),
      };
    },
    { min: Infinity, max: -Infinity },
  );

  const minDate = fromUnixTime(timeBounds.min);
  const maxDate = fromUnixTime(timeBounds.max);
  const totalMinutes = differenceInMinutes(maxDate, minDate);

  const labelStepSize = Math.round(totalMinutes / 4 / 15) * 15;
  const labels = calcTimeLabelsBetweenTimes(
    format(minDate, TIME_FORMAT),
    format(maxDate, TIME_FORMAT),
    labelStepSize,
  );

  const bars = players.map(player => {
    return {
      minuteStart: differenceInMinutes(
        fromUnixTime(player.from.seconds),
        minDate,
      ),
      minuteEnd: differenceInMinutes(
        fromUnixTime(player.until.seconds),
        minDate,
      ),
    };
  });

  return (
    <div className={classes.root}>
      {labels.map((label, idx) => {
        const left = ((idx * labelStepSize) / totalMinutes) * 100;
        return (
          // More than 90% left will run outside of container
          left <= 88 && (
            <Label left={left} key={left}>
              {label}
            </Label>
          )
        );
      })}
      {players.map((player, idx) => {
        const { minuteEnd, minuteStart } = bars[idx];
        const width = ((minuteEnd - minuteStart) / totalMinutes) * 100;
        const left = (minuteStart / totalMinutes) * 100;

        return (
          <Bar width={width} left={left} key={player.uid}>
            <span className={classes.name}>
              {userList.get(player.uid)?.nickname}
            </span>
            <span className={classes.time}>
              {formatTimestamp(player.from)} - {formatTimestamp(player.until)}
            </span>
          </Bar>
        );
      })}
    </div>
  );
};

export default Calendar;
