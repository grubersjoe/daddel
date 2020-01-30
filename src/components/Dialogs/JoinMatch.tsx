import React, { useState } from 'react';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';

import firebase from '../../api/firebase';
import { joinMatch, leaveMatch } from '../../api/match';
import {
  TIME_FORMAT,
  DEFAULT_MATCH_STARTTIME,
  MATCH_TIME_START,
  MATCH_TIME_END,
} from '../../constants/time';
import { theme } from '../../styles/theme';
import { Match, Timestamp } from '../../types';
import { formatDate, formatTimestamp } from '../../utils';

type Props = {
  match: Match;
  initialFrom?: Timestamp;
  initialUntil?: Timestamp;
};

type State = {
  from: string;
  until: string;
};

const calcTimeOptionsBetweenHours = (
  hourStart: number,
  hourEnd: number,
  stepInMinutes = 15,
) => {
  if (hourStart > hourEnd)
    throw new RangeError('hourStart must be smaller than hourEnd');

  let date = new Date();
  date.setHours(hourStart, 0, 0);

  let endDate = new Date();
  endDate.setHours(hourEnd, 0, 0);

  const options = [format(date, TIME_FORMAT)];

  while (isBefore(date, endDate)) {
    date = addMinutes(date, stepInMinutes);
    options.push(format(date, TIME_FORMAT));
  }

  return options;
};

const JoinMatchDialog: React.FC<Props> = ({
  match,
  initialFrom,
  initialUntil,
}) => {
  const timeOptions = calcTimeOptionsBetweenHours(
    MATCH_TIME_START,
    MATCH_TIME_END,
  );

  const timeInitialFrom = initialFrom ? formatTimestamp(initialFrom) : null;
  const timeMatchDate = formatTimestamp(match.date);

  const from =
    timeOptions.find(
      option => option === timeInitialFrom || option === timeMatchDate,
    ) || DEFAULT_MATCH_STARTTIME;

  const timeInitialUntil = initialUntil ? formatTimestamp(initialUntil) : null;

  const until =
    timeOptions.find(option => option === timeInitialUntil) ||
    format(addHours(parse(from, TIME_FORMAT, new Date()), 2), TIME_FORMAT);

  const untilClamped = timeOptions.includes(until)
    ? until
    : timeOptions[timeOptions.length - 1];

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [state, setState] = React.useState<State>({
    from: from,
    until: untilClamped,
  });

  const handleJoin = () => {
    if (!match.id) throw new Error('No match ID given');

    setLoading(true);
    joinMatch({
      availFrom: state.from,
      availUntil: state.until,
      matchId: match.id,
      currentPlayers: match.players,
    })
      .then(() => setOpen(false))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleLeave = () => {
    if (!match.id) throw new Error('No match ID given');

    setLoading(true);
    leaveMatch({
      players: match.players,
      matchId: match.id,
    })
      .then(() => setOpen(false))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const userInLobby = match.players.find(
    player => player.uid === firebase.auth.currentUser?.uid,
  );

  const selectOptions = timeOptions.map(value => (
    <option key={value} value={value}>
      {value}
    </option>
  ));

  return (
    <>
      <Grid container spacing={2}>
        {userInLobby && (
          <Grid item xs={6}>
            <Button
              size="medium"
              variant="outlined"
              onClick={handleLeave}
              disableElevation
              fullWidth
            >
              Doch nicht
            </Button>
          </Grid>
        )}
        <Grid item xs={userInLobby ? 6 : 12}>
          <Button
            color="primary"
            size="medium"
            variant="outlined"
            onClick={() => setOpen(true)}
            fullWidth
          >
            Mitbolzen
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        {loading && <LinearProgress variant="query" />}
        <DialogTitle>{formatDate(match.date)}</DialogTitle>
        <DialogContent>
          <DialogContentText>Von wann bis wann hast du Zeit?</DialogContentText>
          <Grid container style={{ margin: `${theme.spacing(2)}px 0` }}>
            <Grid item xs={6} style={{ paddingRight: theme.spacing(1.5) }}>
              <InputLabel htmlFor="select-from">Ab</InputLabel>
              <Select
                value={state.from}
                onChange={handleChange('from')}
                inputProps={{ id: 'select-from' }}
                fullWidth
                native
              >
                {selectOptions}
              </Select>
            </Grid>
            <Grid item xs={6} style={{ paddingLeft: theme.spacing(1.5) }}>
              <InputLabel htmlFor="select-until">Bis</InputLabel>
              <Select
                value={state.until}
                onChange={handleChange('until')}
                inputProps={{ id: 'select-until' }}
                fullWidth
                native
              >
                {selectOptions}
              </Select>
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error">
              Wie unangenehm, es konnte nicht gespeichert werden:
              <br />
              {error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Abbrechen
          </Button>
          <Button onClick={handleJoin} color="primary" disabled={loading}>
            Mitbolzen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JoinMatchDialog;
