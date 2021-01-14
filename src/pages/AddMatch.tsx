import React, { useState, FormEvent, useEffect, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import firebaseNS from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import addMinutes from 'date-fns/addMinutes';
import deLocale from 'date-fns/locale/de';
import isSameDay from 'date-fns/isSameDay';
import parseDate from 'date-fns/parse';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
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

import { EVENTS } from '../constants';
import {
  DEFAULT_MATCH_LENGTH,
  DEFAULT_MATCH_TIME,
  DEFAULT_TIME_INCREMENT,
  MATCH_TIME_LATEST,
  TIME_FORMAT,
} from '../constants/date';
import ROUTES from '../constants/routes';
import firebase from '../services/firebase';
import { joinMatch } from '../services/match';
import { Match, Game, TimeLabel } from '../types';
import { reorderGames } from '../utils';
import { formatTime } from '../utils/date';
import AppBar from '../components/AppBar';
import { AuthUserContext } from '../components/App';
import { SnackbarContext } from '../components/Layout';

const AddMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const [authUser] = useContext(AuthUserContext);
  const dispatchSnack = useContext(SnackbarContext);

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht angelegt werden', 'error');

  const defaultDate = parseDate(DEFAULT_MATCH_TIME, TIME_FORMAT, new Date());

  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState<Game['id']>();
  const [date, setDate] = useState<Date | null>(defaultDate);
  const [description, setDescription] = useState<string>();
  const [selfJoinMatch, setSelfJoinMatch] = useState(true);

  const [games, gamesLoading] = useCollectionData<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
    { idField: 'id' },
  );

  // Select first available game as soon as games are loaded
  useEffect(() => {
    if (games && games.length > 0) {
      setGameId(games[0].id);
    }
  }, [games]);

  const addMatch = (event: FormEvent, currentUser: firebaseNS.User) => {
    event.preventDefault();

    if (!date || !gameId) {
      return dispatchError();
    }

    setLoading(true);

    const match: Omit<Match, 'id'> = {
      created: firebase.getTimestamp(),
      createdBy: currentUser.uid,
      date: firebase.getTimestamp(date),
      game: firebase.firestore.doc(`games/${gameId}`),
      players: [],
      ...(description && { description }),
    };

    firebase.firestore
      .collection('matches')
      .add(match)
      .then(doc => {
        if (selfJoinMatch) {
          const availFrom = formatTime<TimeLabel>(date);

          const availUntil = isSameDay(
            addMinutes(date, DEFAULT_MATCH_LENGTH),
            date,
          )
            ? formatTime<TimeLabel>(addMinutes(date, DEFAULT_MATCH_LENGTH))
            : MATCH_TIME_LATEST;

          return joinMatch(availFrom, availUntil, { id: doc.id, ...match });
        }
      })
      .then(() => {
        firebase.analytics.logEvent(EVENTS.ADD_MATCH);
        history.push(ROUTES.MATCHES_LIST);
      })
      .catch(dispatchError)
      .finally(() => setLoading(false));
  };

  return (
    <>
      <AppBar title="Neues Match" />
      <Container>
        <Box mb="1.5rem">
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Spiel</InputLabel>
            <Select
              native
              value={gameId}
              onChange={event => setGameId(String(event.target.value))}
              label="Spiel"
              disabled={gamesLoading}
            >
              {gamesLoading && <option>Lade …</option>}
              {games &&
                reorderGames(games).map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                    {game.maxPlayers && ` (${game.maxPlayers} Spieler)`}
                  </option>
                ))}
            </Select>
          </FormControl>
        </Box>

        {authUser && (
          <form
            autoComplete="off"
            onSubmit={event => addMatch(event, authUser)}
          >
            <Box mb="1.5rem">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
                <DateTimePicker
                  label="Datum und Uhrzeit"
                  variant="dialog"
                  inputVariant="outlined"
                  value={date}
                  onChange={setDate}
                  minutesStep={DEFAULT_TIME_INCREMENT}
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
                  checked={selfJoinMatch}
                  onChange={event => setSelfJoinMatch(event.target.checked)}
                />
              }
              label="Selbst mitspielen"
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
                    disabled={!games || games.length === 0 || loading}
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
                    Hinzufügen
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Container>
    </>
  );
};

export default withRouter(AddMatch);
