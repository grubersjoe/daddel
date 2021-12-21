import React, { FormEvent, useContext, useState } from 'react';
import { Timestamp, updateDoc } from 'firebase/firestore';
import { Redirect, StaticContext } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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

import ROUTES from '../constants/routes';
import { reorderGames } from '../utils';
import { Game, Match, Player } from '../types';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import PageMetadata from '../components/PageMetadata';
import DateTimePicker from '../components/DateTimePicker';
import { useGamesCollectionData } from '../hooks/useGamesCollectionData';
import { getDocRef } from '../services/firebase';

type LocationState = {
  game?: Omit<Game, 'game'>;
  match?: Match;
};

const updatePlayerList = (players: Player[], updatedDate: Date): Player[] =>
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

const UpdateMatch: React.FC<
  RouteComponentProps<Record<string, string>, StaticContext, LocationState>
> = ({ location, history }) => {
  const dispatchSnack = useContext(SnackbarContext);

  const dispatchError = () =>
    dispatchSnack('Match konnte nicht bearbeitet werden', 'error');

  const [loading, setLoading] = useState(false);

  // The Game and Match are passed as state through the <Link> component of react-router.
  // If this page is opened directly location.state will be undefined.
  const game = location.state?.game;
  const match = location.state?.match;

  const [gameId, setGameId] = useState<Maybe<Game['id']>>(game?.id);
  const [date, setDate] = useState<Date | null>(match?.date.toDate() ?? null);
  const [description, setDescription] = useState<string>(
    match?.description ?? '',
  );

  const [games, gamesLoading] = useGamesCollectionData();

  // Hooks must not be called conditionally.
  // So bailing out is not possible earlier.
  if (!game || !match) {
    return <Redirect to={ROUTES.MATCHES_LIST} />;
  }

  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!date || !gameId) {
      return dispatchError();
    }

    const updatedMatch: Omit<Match, 'id' | 'created' | 'createdBy'> = {
      date: Timestamp.fromDate(date),
      description,
      game: getDocRef<Game>('games', gameId),
      players: updatePlayerList(match.players, date),
    };

    updateDoc<Match>(getDocRef('matches', match.id), updatedMatch)
      .then(() => {
        dispatchSnack('Match aktualisiert');
        history.push(ROUTES.MATCHES_LIST);
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
            value={gameId}
            onChange={event => setGameId(String(event.target.value))}
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

export default withRouter(UpdateMatch);
