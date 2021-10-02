import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import firebaseNS from 'firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';
import addMinutes from 'date-fns/addMinutes';
import isSameDay from 'date-fns/isSameDay';
import isValid from 'date-fns/isValid';
import parseDate from 'date-fns/parse';

import { EVENTS } from '../constants';
import {
  DEFAULT_MATCH_LENGTH,
  DEFAULT_MATCH_TIME,
  MATCH_TIME_LATEST,
  TIME_FORMAT,
} from '../constants/date';
import ROUTES from '../constants/routes';
import firebase from '../services/firebase';
import { joinMatch } from '../services/match';
import { Game, Match } from '../types';
import { reorderGames } from '../utils';
import { parseTime } from '../utils/date';
import { AuthUserContext } from '../components/App';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import PageMetadata from '../components/PageMetadata';
import DateTimePicker from '../components/DateTimePicker';

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
          const defaultAvailUntil = addMinutes(date, DEFAULT_MATCH_LENGTH);
          const availUntil = isSameDay(defaultAvailUntil, date)
            ? defaultAvailUntil
            : parseTime(MATCH_TIME_LATEST, date);

          return joinMatch(date, availUntil, { id: doc.id, ...match });
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
      <PageMetadata title="Neues Match – Daddel" />
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
              <DateTimePicker date={date} setDate={setDate} />
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
                  <Button onClick={history.goBack} disabled={loading} fullWidth>
                    Abbrechen
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={
                      !games || games.length === 0 || !isValid(date) || loading
                    }
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
