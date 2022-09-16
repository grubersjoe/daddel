import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { addDoc, Timestamp } from 'firebase/firestore';
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
import { useNavigate } from 'react-router-dom';

import { GA_EVENTS } from '../constants';
import {
  DEFAULT_MATCH_LENGTH,
  DEFAULT_MATCH_TIME,
  MATCH_TIME_LATEST,
  TIME_FORMAT,
} from '../constants/date';
import routes from '../constants/routes';
import { joinMatch } from '../services/match';
import { Game, Match } from '../types';
import { reorderGames } from '../utils/games';
import { parseTime } from '../utils/date';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import PageMetadata from '../components/PageMetadata';
import DateTimePicker from '../components/DateTimePicker';
import { useGamesCollectionData } from '../hooks/useGamesCollectionData';
import {
  analytics,
  auth,
  getCollectionRef,
  getDocRef,
} from '../services/firebase';

const AddMatch: React.FC = () => {
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);
  const dispatchSnack = useContext(SnackbarContext);

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht angelegt werden', 'error');

  const defaultDate = parseDate(DEFAULT_MATCH_TIME, TIME_FORMAT, new Date());

  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState<Game['id']>();
  const [date, setDate] = useState<Date | null>(defaultDate);
  const [description, setDescription] = useState<string>();
  const [selfJoinMatch, setSelfJoinMatch] = useState(true);

  const [games, gamesLoading] = useGamesCollectionData();

  // Select first available game as soon as games are loaded
  useEffect(() => {
    if (!gameId && games && games.length > 0) {
      setGameId(games[0].id);
    }
  }, [gameId, games]);

  if (!authUser) {
    return null;
  }

  const addMatch = (event: FormEvent, authUser: User) => {
    event.preventDefault();

    if (!date || !gameId) {
      return dispatchError();
    }

    setLoading(true);

    const match: Omit<Match, 'id'> = {
      created: Timestamp.fromDate(new Date()),
      createdBy: authUser.uid,
      date: Timestamp.fromDate(date),
      game: getDocRef<Game>('games', gameId),
      players: [],
      reactions: [],
      ...(description && { description }),
    };

    addDoc<Match>(getCollectionRef('matches'), match)
      .then(doc => {
        if (selfJoinMatch) {
          const defaultAvailUntil = addMinutes(date, DEFAULT_MATCH_LENGTH);
          const availUntil = isSameDay(defaultAvailUntil, date)
            ? defaultAvailUntil
            : parseTime(MATCH_TIME_LATEST, date);

          return joinMatch(authUser, date, availUntil, {
            id: doc.id,
            ...match,
          });
        }
      })
      .then(() => {
        logEvent(analytics, GA_EVENTS.ADD_MATCH);
        navigate(routes.matchList);
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
              <DateTimePicker date={date} onChange={setDate} />
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
                    onClick={() => window.history.go(-1)}
                    disabled={loading}
                    fullWidth
                  >
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

export default AddMatch;
