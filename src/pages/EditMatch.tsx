import React, {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Timestamp, updateDoc } from 'firebase/firestore';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import setDate from 'date-fns/set';
import isValid from 'date-fns/isValid';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Select,
  TextField,
} from '@mui/material';

import routes from '../constants/routes';
import { reorderGames } from '../utils/games';
import { Game, Match, Player } from '../types';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import PageMetadata from '../components/PageMetadata';
import DateTimePicker from '../components/DateTimePicker';
import { useGamesCollectionData } from '../hooks/useGamesCollectionData';
import { getDocRef } from '../services/firebase';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

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

  const [games, gamesLoading] = useGamesCollectionData();
  const [loading, setLoading] = useState(false);

  const [matchState, setMatchState] = useState<{
    game?: string;
    date?: Date;
    description?: string;
  }>({});

  useEffect(() => {
    if (match) {
      setMatchState({
        game: match.game.id,
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
      game: getDocRef<Game>('games', matchState.game),
      players: updatePlayerList(match.players, matchState.date),
      description: matchState.description,
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
        <Box mb="1.5rem">
          <Select
            value={matchState.game}
            onChange={event =>
              setMatchState(prev => ({
                ...prev,
                game: String(event.target.value),
              }))
            }
            variant="outlined"
            disabled={gamesLoading}
            fullWidth
            native
          >
            {gamesLoading && <option>Lade …</option>}
            {games &&
              reorderGames(games).map(game => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
          </Select>
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
              rows={2}
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
                    !games ||
                    games.length === 0 ||
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
