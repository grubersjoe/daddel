import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { addMinutes } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  DEFAULT_MATCH_LENGTH_MINUTES,
  DEFAULT_MATCH_TIME,
  MATCH_TIME_EARLIEST,
  MATCH_TIME_LATEST,
  MATCH_TIME_OPEN_END,
} from '../../constants/date';
import { auth } from '../../services/firebase';
import { joinMatch, leaveMatch } from '../../services/match';
import { Match, TimeString } from '../../types';
import {
  formatTime,
  timeStringsBetweenDates,
  timeToDate,
} from '../../utils/date';

interface Props {
  match: Match;
  playerFrom?: Timestamp;
  playerUntil?: Timestamp;
}

type State = {
  availFrom: TimeString;
  availUntil: TimeString;
};

const today = new Date(); // Each day has the same hours, so that's okay.

export const timeOptions = timeStringsBetweenDates(
  timeToDate(MATCH_TIME_EARLIEST, today),
  timeToDate(MATCH_TIME_LATEST, today),
);

export const timeOptionsWithOpenEnd = [...timeOptions, MATCH_TIME_OPEN_END];

const renderSelectOptions = (
  times: Array<TimeString>,
  optionsArg = {
    includeOpenEnd: false,
  },
) => {
  const options = times.map(time => (
    <option key={time} value={time}>
      {time}
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

const JoinMatchDialog = ({ match }: Props) => {
  const [authUser] = useAuthState(auth);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const currentPlayer = match.players.find(
    player => player.uid === authUser?.uid,
  );

  const currentFrom = currentPlayer ? formatTime(currentPlayer.from) : null;
  const currentUntil = currentPlayer ? formatTime(currentPlayer.until) : null;
  const matchTime = formatTime(match.date);

  const availFrom =
    timeOptions.find(time => time === currentFrom) ??
    timeOptions.find(time => time === matchTime) ??
    DEFAULT_MATCH_TIME;

  const defaultAvailUntil = formatTime(
    addMinutes(
      timeToDate(availFrom, match.date.toDate()),
      DEFAULT_MATCH_LENGTH_MINUTES,
    ),
  );

  const availUntil =
    timeOptionsWithOpenEnd.find(time => time === currentUntil) ??
    timeOptions.find(time => time === defaultAvailUntil) ??
    timeOptions.at(-1);

  if (!availUntil) {
    throw new Error('Unexpected error: availUntil undefined');
  }

  const [state, setState] = useState<State>({
    availFrom,
    availUntil,
  });

  // availUntil time must not be before the availFrom.
  // Automatically select a later time if availFrom changes.
  useEffect(() => {
    const indexAvailFrom = timeOptions.indexOf(state.availFrom);

    if (
      state.availUntil !== MATCH_TIME_OPEN_END &&
      indexAvailFrom >= timeOptions.indexOf(state.availUntil)
    ) {
      setState(state => ({
        ...state,
        availUntil: timeOptions[indexAvailFrom + 2] ?? MATCH_TIME_OPEN_END, // Add half an hour if possible
      }));
    }
  }, [state.availFrom, state.availUntil]);

  if (!authUser) {
    return null;
  }

  const handleJoin = () => {
    setLoading(true);
    setError(null);

    const availFrom = timeToDate(state.availFrom, match.date.toDate());
    const availUntil = timeToDate(state.availUntil, match.date.toDate());

    joinMatch(authUser, availFrom, availUntil, match)
      .then(() => {
        setOpen(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLeave = () => {
    setLoading(true);
    setError(null);

    leaveMatch(authUser, match)
      .then(() => {
        setOpen(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTimeChange =
    (prop: keyof typeof state) => (event: SelectChangeEvent<TimeString>) => {
      setState({
        ...state,
        [prop]: event.target.value,
      });
    };

  const userInLobby = match.players.find(player => player.uid === authUser.uid);

  return (
    <>
      <Grid container spacing={2}>
        {userInLobby && (
          <Grid item xs={6}>
            <Button onClick={handleLeave} disableElevation fullWidth>
              Doch nicht
            </Button>
          </Grid>
        )}
        <Grid item xs={userInLobby ? 6 : 12}>
          <Button
            color="primary"
            onClick={() => {
              setOpen(true);
            }}
            fullWidth
          >
            {userInLobby ? 'Zeit ändern' : 'Mitspielen'}
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Mitspielen</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <DialogContentText>Von wann bis wann hast du Zeit?</DialogContentText>
          <Grid container sx={{ my: 2 }}>
            <Grid item xs={6} sx={{ pr: 1.5 }}>
              <InputLabel htmlFor="select-from">Ab</InputLabel>
              <Select
                value={state.availFrom}
                onChange={handleTimeChange('availFrom')}
                inputProps={{ id: 'select-from' }}
                size="small"
                fullWidth
                native
              >
                {renderSelectOptions(timeOptions)}
              </Select>
            </Grid>
            <Grid item xs={6} sx={{ pl: 1.5 }}>
              <InputLabel htmlFor="select-until">Bis</InputLabel>
              <Select
                value={state.availUntil}
                onChange={handleTimeChange('availUntil')}
                inputProps={{ id: 'select-until' }}
                size="small"
                fullWidth
                native
              >
                {renderSelectOptions(
                  // Let the user select only times past current availFrom time
                  timeOptions.slice(timeOptions.indexOf(state.availFrom) + 1),
                  { includeOpenEnd: true },
                )}
              </Select>
            </Grid>
          </Grid>
          {error && <Alert severity="error">Fehler: {error.message}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            disabled={loading}
            variant="text"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleJoin}
            color="primary"
            disabled={loading}
            variant="text"
          >
            Mitspielen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JoinMatchDialog;
