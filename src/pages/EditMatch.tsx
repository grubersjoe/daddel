import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import isValid from 'date-fns/isValid';
import setDate from 'date-fns/set';
import { Timestamp, updateDoc } from 'firebase/firestore';
import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SteamAuthentication from '../components/Auth/SteamAuthentication';
import DateTimePicker from '../components/DateTimePicker';
import { SnackbarContext } from '../components/Layout';
import GameSelect from '../components/Match/GameSelect';
import PageMetadata from '../components/PageMetadata';
import routes from '../constants/routes';
import { useSteamUser } from '../hooks/useSteamUser';
import { getDocRef } from '../services/firebase';
import { Game, Match, Player } from '../types';
import { isSteamGame } from '../types/guards';

const updatePlayerList = (
  players: Array<Player>,
  updatedDate: Date,
): Array<Player> =>
  players.map(player => {
    const updateDate = {
      year: updatedDate.getFullYear(),
      month: updatedDate.getMonth(),
      date: updatedDate.getDate(),
    };

    return {
      uid: player.uid,
      from: Timestamp.fromDate(setDate(player.from.toDate(), updateDate)),
      until: Timestamp.fromDate(setDate(player.until.toDate(), updateDate)),
    };
  });

const EditMatch: FunctionComponent = () => {
  const navigate = useNavigate();
  const dispatchSnack = useContext(SnackbarContext);

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht bearbeitet werden', 'error');

  const { id } = useParams<{ id: string }>();
  const [match, matchLoading, matchError] = useDocumentDataOnce<Match>(
    getDocRef('matches', id),
    { idField: 'id' },
  );

  const { data: steamUser } = useSteamUser();
  const [loading, setLoading] = useState(false);

  const [matchState, setMatchState] = useState<{
    game?: Game;
    date?: Date;
    description?: string;
  }>({});

  useEffect(() => {
    if (match) {
      setMatchState({
        game: match.game,
        date: match.date.toDate(),
        description: match.description,
      });
    }
  }, [match, matchLoading]);

  if (matchError || (!matchLoading && !match)) {
    dispatchSnack(`Match kann nicht bearbeitet werden`, 'error');

    return <Navigate to={routes.matchList} />;
  }

  if (matchLoading || !match) {
    return null;
  }

  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!matchState.date || !matchState.game) {
      return dispatchError();
    }

    const updatedMatch: Omit<
      Match,
      'id' | 'created' | 'createdBy' | 'reactions'
    > = {
      date: Timestamp.fromDate(matchState.date),
      game: matchState.game,
      players: updatePlayerList(match.players, matchState.date),
      ...(matchState.description && { description: matchState.description }),
    };

    updateDoc<Match>(getDocRef('matches', match.id), updatedMatch)
      .then(() => {
        dispatchSnack('Match aktualisiert');
        navigate(routes.matchList);
      })
      .catch(dispatchError)
      .finally(() => setLoading(false));
  };

  return (
    <>
      <PageMetadata title="Match bearbeiten – Daddel" />
      <AppBar title="Match bearbeiten" />
      <Container>
        {!steamUser && (
          <Box mt={2} mb={5}>
            <Typography variant="body1" color="textSecondary" mb={2}>
              Melde dich bei Steam an, um all deine verfügbaren Spiele zu laden.
            </Typography>
            <SteamAuthentication />
          </Box>
        )}
        <Box mt={2} mb={3}>
          <GameSelect
            defaultValue={match.game}
            onChange={game => {
              if (game) {
                setMatchState(prev => ({
                  ...prev,
                  game: {
                    name: game.name,
                    ...(isSteamGame(game) && { steamAppId: game.appid }),
                  },
                }));
              }
            }}
          />
        </Box>

        <form autoComplete="off" onSubmit={handleUpdate}>
          <Box mb="1.5rem">
            <DateTimePicker
              date={matchState.date ?? null}
              onChange={date =>
                setMatchState(prev => ({
                  ...prev,
                  ...(date && { date }),
                }))
              }
            />
          </Box>
          <Box mb="1rem">
            <TextField
              label="Beschreibung (optional)"
              defaultValue={match.description}
              variant="outlined"
              onChange={event =>
                setMatchState(prev => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              multiline
              rows={3}
              fullWidth
            />
          </Box>
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
                    !matchState.game?.name ||
                    !isValid(matchState.date) ||
                    loading
                  }
                  startIcon={
                    loading ? (
                      <CircularProgress
                        color="inherit"
                        size={22}
                        thickness={3}
                      />
                    ) : null
                  }
                  fullWidth
                >
                  Speichern
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default EditMatch;
