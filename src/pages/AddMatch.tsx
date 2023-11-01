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
import addMinutes from 'date-fns/addMinutes';
import isSameDay from 'date-fns/isSameDay';
import isValid from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { logEvent } from 'firebase/analytics';
import { User } from 'firebase/auth';
import { addDoc, Timestamp } from 'firebase/firestore';
import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SteamAuthentication from '../components/Auth/SteamAuthentication';
import DateTimePicker from '../components/DateTimePicker';
import { SnackbarContext } from '../components/Layout';
import GameSelect, { GameOption } from '../components/Match/GameSelect';
import PageMetadata from '../components/PageMetadata';
import { GA_EVENTS } from '../constants';
import {
  DEFAULT_MATCH_LENGTH,
  DEFAULT_MATCH_TIME,
  MATCH_TIME_LATEST,
  TIME_FORMAT,
} from '../constants/date';
import routes from '../constants/routes';
import { useSteamUser } from '../hooks/useSteamUser';
import { analytics, auth, getCollectionRef } from '../services/firebase';
import { joinMatch } from '../services/match';
import { NewMatch } from '../types';
import { isSteamGame } from '../types/guards';
import { parseTime } from '../utils/date';

const AddMatch: FunctionComponent = () => {
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
    } satisfies NewMatch;

    addDoc(getCollectionRef('matches'), match)
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
        <Box mt={2} mb={3}>
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
