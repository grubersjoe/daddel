import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(4),
    fontSize: '80%',
  },
  label: {
    position: 'absolute',
    top: 0,
    height: '100%',
    paddingLeft: '0.4em',
    borderLeft: 'solid 1px rgba(255, 255, 255, 0.15)',
  },
  bar: {
    position: 'relative',
    top: 0,
    marginBottom: 8,
    padding: '0.15em',
    backgroundColor: '#666',
    borderRadius: 2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  time: {
    marginLeft: '0.75em',
    color: 'rgba(255, 255, 255, 0.75)',
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
