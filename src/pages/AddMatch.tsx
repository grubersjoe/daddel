import React, { useState, FormEvent, useEffect, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import firebaseNS from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import addHours from 'date-fns/addHours';
import isSameDay from 'date-fns/isSameDay';
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
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';

import firebase from '../services/firebase';
import { joinMatch } from '../services/match';
import ROUTES from '../constants/routes';
import { Match, Game, TimeLabel } from '../types';
import {
  DEFAULT_MATCH_STARTTIME,
  DEFAULT_TIME_INCREMENT,
  MATCH_TIME_END,
  TIME_FORMAT,
} from '../constants/date';
import { reorderGames } from '../utils';
import { format } from '../utils/date';
import { AuthUserContext } from '../components/App';
import AppBar from '../components/AppBar';
import { SnackbarContext } from '../components/Layout';

const AddMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const [authUser] = useContext(AuthUserContext);
  const dispatchSnack = useContext(SnackbarContext);

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht angelegt werden', 'error');

  const [loading, setLoading] = useState(false);

  const [defaultHour, defaultMinute] = DEFAULT_MATCH_STARTTIME.split(':');
  const defaultDate = setMinutes(
    setHours(new Date(), Number(defaultHour)),
    Number(defaultMinute),
  );

  const [gameId, setGameId] = useState<Game['id']>();
  const [date, setDate] = useState<Date | null>(defaultDate); // null required for MUI
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
      ...(description && { description }),
      game: firebase.firestore.doc(`games/${gameId}`),
      players: [],
    };

    firebase.firestore
      .collection('matches')
      .add(match)
      .then(doc => {
        if (selfJoinMatch) {
          const availFrom = format(date, TIME_FORMAT) as TimeLabel;
          const availUntil = isSameDay(addHours(date, 2), date)
            ? format<TimeLabel>(addHours(date, 2), TIME_FORMAT)
            : MATCH_TIME_END;

          joinMatch(availFrom, availUntil, { id: doc.id, ...match })
            .then(() => history.push(ROUTES.MATCHES_LIST))
            .catch(dispatchError)
            .finally(() => setLoading(false));
        } else {
          history.push(ROUTES.MATCHES_LIST);
          setLoading(false);
        }
      })
      .catch(dispatchError);
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
