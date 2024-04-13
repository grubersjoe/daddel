import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { addMinutes, isSameDay, isValid, parse as parseDate } from 'date-fns';
import { logEvent } from 'firebase/analytics';
import { User } from 'firebase/auth';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { FormEvent, useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SteamAuthentication from '../components/Auth/SteamAuthentication';
import DateTimePicker from '../components/DateTimePicker';
import { SnackbarContext } from '../components/Layout';
import GameSelect from '../components/Match/GameSelect';
import PageMetadata from '../components/PageMetadata';
import { GA_EVENTS } from '../constants';
import {
  DEFAULT_MATCH_LENGTH_MINUTES,
  DEFAULT_MATCH_TIME,
  MATCH_TIME_LATEST,
  TIME_FORMAT,
} from '../constants/date';
import routes from '../constants/routes';
import { useSteamUser } from '../hooks/useSteamUser';
import { analytics, auth, firestore } from '../services/firebase';
import { joinMatch } from '../services/match';
import { GameOption, MatchDraft, isSteamGame } from '../types';
import { timeToDate } from '../utils/date';

const AddMatch = () => {
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);
  const dispatchSnack = useContext(SnackbarContext);

  const { data: steamUser } = useSteamUser();

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht angelegt werden', 'error');

  const defaultDate = parseDate(DEFAULT_MATCH_TIME, TIME_FORMAT, new Date());

  const [loading, setLoading] = useState(false);

  const [game, setGame] = useState<GameOption | null>(null);
  const [date, setDate] = useState<Date | null>(defaultDate);
  const [maxPlayers, setMaxPlayers] = useState<string>('');
  const [description, setDescription] = useState<string>();
  const [selfJoinMatch, setSelfJoinMatch] = useState(true);

  if (!authUser) {
    return null;
  }

  const addMatch = (event: FormEvent, authUser: User) => {
    event.preventDefault();

    if (!date || !game) {
      return dispatchError();
    }

    setLoading(true);

    const match = {
      created: Timestamp.fromDate(new Date()),
      createdBy: authUser.uid,
      date: Timestamp.fromDate(date),
      game: {
        name: game.name,
        steamAppId: isSteamGame(game) ? game.appid : null,
        maxPlayers: Number(maxPlayers),
      },
      players: [],
      reactions: [],
      description: description ?? null,
    } satisfies MatchDraft;

    addDoc(collection(firestore, 'matches'), match)
      .then(doc => {
        if (selfJoinMatch) {
          const defaultAvailUntil = addMinutes(
            date,
            DEFAULT_MATCH_LENGTH_MINUTES,
          );
          const availUntil = isSameDay(defaultAvailUntil, date)
            ? defaultAvailUntil
            : timeToDate(MATCH_TIME_LATEST, date);

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
      <Container sx={{ my: 1 }}>
        <Box mb={3}>
          <GameSelect onChange={setGame} />
        </Box>

        <form autoComplete="off" onSubmit={event => addMatch(event, authUser)}>
          <Box mb={3}>
            <DateTimePicker date={date} onChange={setDate} />
          </Box>

          <Box mb={3}>
            <TextField
              type="number"
              label="Anzahl Spieler"
              inputProps={{
                inputMode: 'numeric',
                min: 2,
                max: 50,
              }}
              value={maxPlayers}
              onChange={event => setMaxPlayers(event.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>

          <Box mb={3}>
            <TextField
              label="Beschreibung"
              value={description}
              onChange={event => setDescription(event.target.value)}
              multiline
              rows={3}
              variant="outlined"
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

          {!steamUser && (
            <Box mt={2} mb={5}>
              <Typography variant="body1" color="textSecondary" mb={2}>
                Melde dich bei Steam an, um all deine verfügbaren Spiele
                anzuzeigen.
              </Typography>
              <SteamAuthentication />
            </Box>
          )}

          <Box my={3} sx={{ display: 'flex', gap: 2, justifyContent: 'end' }}>
            <Button onClick={() => window.history.go(-1)} disabled={loading}>
              Abbrechen
            </Button>

            <Button
              type="submit"
              color="primary"
              disabled={!game?.name || !isValid(date) || loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={16} thickness={4} />
                ) : null
              }
            >
              Hinzufügen
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default AddMatch;
