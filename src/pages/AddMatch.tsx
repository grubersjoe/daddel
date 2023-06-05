import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import addMinutes from 'date-fns/addMinutes';
import isSameDay from 'date-fns/isSameDay';
import isValid from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { logEvent } from 'firebase/analytics';
import { User } from 'firebase/auth';
import { Timestamp, addDoc } from 'firebase/firestore';
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

  const { data: steamUser, isPlaceholderData: steamUserLoading } =
    useSteamUser();

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht angelegt werden', 'error');

  const defaultDate = parseDate(DEFAULT_MATCH_TIME, TIME_FORMAT, new Date());

  const [loading, setLoading] = useState(false);

  const [game, setGame] = useState<GameOption | null>(null);
  const [date, setDate] = useState<Date | null>(defaultDate);
  const [description, setDescription] = useState<string>();
  const [selfJoinMatch, setSelfJoinMatch] = useState(true);

  if (!authUser || steamUserLoading) {
    return null;
  }

  const addMatch = (event: FormEvent, authUser: User) => {
    event.preventDefault();

    if (!date || !game) {
      return dispatchError();
    }

    setLoading(true);

    const match: NewMatch = {
      created: Timestamp.fromDate(new Date()),
      createdBy: authUser.uid,
      date: Timestamp.fromDate(date),
      game: {
        name: game.name,
        ...(isSteamGame(game) && { steamAppId: game.appid }),
      },
      players: [],
      reactions: [],
      ...(description && { description }),
    };

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
        {steamUser ? (
          <Box mt={2} mb={3}>
            <GameSelect onChange={setGame} />
          </Box>
        ) : (
          <Grid container spacing={2} flexDirection="column" mt={0}>
            <Grid item md={7}>
              <Typography variant="body1" color="textSecondary" mb={3}>
                Melde dich bei Steam an, um ein neues Match für eines deiner
                Spiele anzulegen.
              </Typography>
              <SteamAuthentication />
            </Grid>
          </Grid>
        )}

        {steamUser && (
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
                rows={3}
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
                    disabled={!game?.name || !isValid(date) || loading}
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
