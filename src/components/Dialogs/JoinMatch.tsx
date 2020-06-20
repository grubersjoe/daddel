import React, { useState, useEffect } from 'react';
import addHours from 'date-fns/addHours';
import startOfToday from 'date-fns/startOfToday';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MuiLinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';

import firebase from '../../api/firebase';
import { joinMatch, leaveMatch } from '../../api/match';
import {
  TIME_FORMAT,
  DEFAULT_MATCH_STARTTIME,
  MATCH_TIME_START,
  MATCH_TIME_END,
  MATCH_TIME_OPEN_END,
} from '../../constants/date';
import { theme } from '../../styles/theme';
import { Match, Timestamp, TimeLabel } from '../../types';
import {
  format,
  formatDate,
  formatTimestamp,
  calcTimeLabelsBetweenDates,
  parseTimeLabel,
} from '../../utils/date';

type Props = {
  match: Match;
  initialFrom?: Timestamp;
  initialUntil?: Timestamp;
};

type State = {
  availFrom: TimeLabel;
  availUntil: TimeLabel;
};

const LinearProgress = withStyles({
  root: {
    height: 6,
    backgroundColor: theme.palette.grey[700],
  },
})(MuiLinearProgress);

const JoinMatchDialog: React.FC<Props> = ({
  match,
  initialFrom,
  initialUntil,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const timeLabels = calcTimeLabelsBetweenDates(
    parseTimeLabel(MATCH_TIME_START, startOfToday()),
    parseTimeLabel(MATCH_TIME_END, startOfToday()),
  );

  const timeInitialFrom = initialFrom ? formatTimestamp(initialFrom) : null;
  const timeMatchDate = formatTimestamp(match.date);

  const availFrom =
    timeLabels.find(option => option === timeInitialFrom) ||
    timeLabels.find(option => option === timeMatchDate) ||
    DEFAULT_MATCH_STARTTIME;

  const defaultAvailUntil = format<TimeLabel>(
    addHours(parseTimeLabel(availFrom), 2),
    TIME_FORMAT,
  );

  const availUntilFallback = timeLabels.includes(defaultAvailUntil)
    ? defaultAvailUntil
    : timeLabels[timeLabels.length - 1];

  const timeInitialUntil = initialUntil ? formatTimestamp(initialUntil) : null;
  const availUntil =
    [...timeLabels, MATCH_TIME_OPEN_END as TimeLabel].find(
      option => option === timeInitialUntil,
    ) || availUntilFallback;

  const [state, setState] = React.useState<State>({ availFrom, availUntil });

  // Required to sync state with possibly recalculated
  // values of availFrom and availUntilClamped
  useEffect(() => setState({ availFrom, availUntil }), [availFrom, availUntil]);

  const handleJoin = () => {
    setLoading(true);
    joinMatch(state.availFrom, state.availUntil, match)
      .then(() => setOpen(false))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleLeave = () => {
    if (!match.id) {
      throw new Error('No match ID given');
    }

    setLoading(true);
    leaveMatch({
      players: match.players,
      matchId: match.id,
    })
      .then(() => setOpen(false))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (stateProp: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({
      ...state,
      [stateProp]: event.target.value,
    });
  };

  const userInLobby = match.players.find(
    player => player.uid === firebase.auth.currentUser?.uid,
  );

  const getSelectOptions = (
    timeLabels: string[],
    optionsArg = {
      includeOpenEnd: false,
    },
  ) => {
    let options = timeLabels.map(label => (
      <option key={label} value={label}>
        {label}
      </option>
    ));

    if (optionsArg.includeOpenEnd) {
      options.push(
        <option key={MATCH_TIME_OPEN_END} value={MATCH_TIME_OPEN_END}>
          Open end
        </option>,
      );
    }

    return options;
  };

  return (
    <>
      <Grid container spacing={2}>
        {userInLobby && (
          <Grid item xs={6}>
            <Button
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
            variant="outlined"
            onClick={() => setOpen(true)}
            fullWidth
          >
            {userInLobby ? 'Zeit ändern' : 'Mitbolzen'}
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        {loading && <LinearProgress />}
        <DialogTitle>{formatDate(match.date)}</DialogTitle>
        <DialogContent>
          <DialogContentText>Von wann bis wann hast du Zeit?</DialogContentText>
          <Grid container style={{ margin: `${theme.spacing(2)}px 0` }}>
            <Grid item xs={6} style={{ paddingRight: theme.spacing(1.5) }}>
              <InputLabel htmlFor="select-from">Ab</InputLabel>
              <Select
                value={state.availFrom}
                onChange={handleChange('availFrom')}
                inputProps={{ id: 'select-from' }}
                fullWidth
                native
              >
                {getSelectOptions(timeLabels)}
              </Select>
            </Grid>
            <Grid item xs={6} style={{ paddingLeft: theme.spacing(1.5) }}>
              <InputLabel htmlFor="select-until">Bis</InputLabel>
              <Select
                value={state.availUntil}
                onChange={handleChange('availUntil')}
                inputProps={{ id: 'select-until' }}
                fullWidth
                native
              >
                {getSelectOptions(
                  timeLabels.slice(timeLabels.indexOf(state.availFrom) + 1),
                  { includeOpenEnd: true },
                )}
              </Select>
            </Grid>
          </Grid>
          {error && <Alert severity="error">Fehler: {error.message}</Alert>}
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
