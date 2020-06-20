import React, { useState, FormEvent, useEffect, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import firebaseNS from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import addHours from 'date-fns/addHours';
import isSameDay from 'date-fns/isSameDay';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';

import firebase from '../api/firebase';
import { joinMatch } from '../api/match';
import ROUTES from '../constants/routes';
import { Match, Game, TimeLabel } from '../types';
import {
  DEFAULT_MATCH_STARTTIME,
  MATCH_TIME_END,
  TIME_FORMAT,
} from '../constants/date';
import { format } from '../utils/date';
import { AuthUserContext } from '../components/App';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';

const AddMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const [authUser] = useContext(AuthUserContext);
  const dispatchSnack = useContext(SnackbarContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [defaultHour, defaultMinute] = DEFAULT_MATCH_STARTTIME.split(':');
  const defaultDate = setMinutes(
    setHours(new Date(), Number(defaultHour)),
    Number(defaultMinute),
  );

  const [gid, setGid] = useState<Game['gid']>('');
  const [date, setDate] = useState<Date | null>(defaultDate); // null because of MUI
  const [description, setDescription] = useState('');
  const [joinLobby, setJoinLobby] = useState(true);

  const [games, gamesLoading, gamesError] = useCollectionData<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
    { idField: 'gid' },
  );

  // Select first available game as soon as games are loaded
  useEffect(() => {
    if (games && games.length > 0) {
      setGid(games[0].gid);
    }
  }, [games]);

  if (gamesError) console.error(gamesError);
  if (error) console.error(error);

  const addMatch = (event: FormEvent, currentUser: firebaseNS.User) => {
    event.preventDefault();

    if (!date) {
      throw new Error('Date is not set');
    }

    if (!games) {
      throw new Error('Games are not loaded yet');
    }

    setLoading(true);

    const match: Match = {
      created: firebase.timestamp(),
      createdBy: currentUser.uid,
      date: firebase.timestamp(date),
      description,
      gameRef: firebase.firestore.doc(`games/${gid}`),
      players: [],
    };

    firebase.firestore
      .collection('matches')
      .add(match)
      .then(doc => {
        if (joinLobby) {
          const availFrom = format(date, TIME_FORMAT) as TimeLabel;
          const availUntil = isSameDay(addHours(date, 2), date)
            ? format<TimeLabel>(addHours(date, 2), TIME_FORMAT)
            : MATCH_TIME_END;

          joinMatch(availFrom, availUntil, { id: doc.id, ...match })
            .then(() => history.push(ROUTES.MATCHES_LIST))
            .catch(setError)
            .finally(() => setLoading(false));
        } else {
          dispatchSnack('Fehler', 'error');
          history.push(ROUTES.MATCHES_LIST);
          setLoading(false);
        }
      })
      .catch(setError);
  };

  return (
    <>
      <AppBar title="Neuer Bolz" />
      <Container>
        <Box mb="1.5rem">
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Spiel</InputLabel>
            <Select
              native
              value={gid}
              onChange={event => setGid(String(event.target.value))}
              label="Spiel"
              disabled={gamesLoading}
            >
              {gamesLoading && <option>Lade …</option>}
              {games &&
                games.map(game => (
                  <option key={game.gid} value={game.gid}>
                    {game.name}
                    {game.maxPlayers ? ` (${game.maxPlayers} Spieler)` : null}
                  </option>
                ))}
            </Select>
          </FormControl>
        </Box>

        {authUser && (
          <form
            autoComplete="off"
            onSubmit={event => addMatch(event, authUser)}
            onChange={() => setError(null)}
          >
            <Box mb="1.5rem">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
                <DateTimePicker
                  label="Datum und Uhrzeit"
                  variant="dialog"
                  inputVariant="outlined"
                  value={date}
                  onChange={setDate}
                  minutesStep={15}
                  ampm={false}
                  disablePast
                  required
                  fullWidth
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Box mb="1rem">
              <TextField
                label="Beschreibung (optional)"
                defaultValue={description}
                variant="outlined"
                onChange={event => setDescription(event.target.value)}
                multiline
                rows={2}
                fullWidth
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={joinLobby}
                  onChange={event => setJoinLobby(event.target.checked)}
                />
              }
              label="Selbst mitbolzen"
            />
            <Box my="1.5rem">
              <Grid container direction="row" spacing={2}>
                <Grid item xs>
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={history.goBack}
                    disabled={loading}
                    fullWidth
                  >
                    Abbrechen
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    disabled={!games || loading}
                    startIcon={
                      loading ? (
                        <CircularProgress
                          color="inherit"
                          size={18}
                          thickness={3}
                        />
                      ) : null
                    }
                    fullWidth
                  >
                    Jajaja
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}

        {error && <Alert severity="error">Fehler: {error.message}</Alert>}
      </Container>
    </>
  );
};

export default withRouter(AddMatch);
