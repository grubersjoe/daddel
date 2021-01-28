import React, { useState, FormEvent, useContext } from 'react';
import { Redirect, StaticContext } from 'react-router';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import deLocale from 'date-fns/locale/de';
import set from 'date-fns/set';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import ROUTES from '../constants/routes';
import { DEFAULT_TIME_INCREMENT } from '../constants/date';
import firebase from '../services/firebase';
import { reorderGames } from '../utils';
import { Match, Game, Player } from '../types';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import PageMetadata from '../components/PageMetadata';

type LocationState = {
  game?: Omit<Game, 'game'>;
  match?: Match;
};

const updatePlayerList = (players: Player[], updatedDate: Date): Player[] =>
  players.map(player => {
    const updatedValues = {
      year: updatedDate.getFullYear(),
      month: updatedDate.getMonth(),
      date: updatedDate.getDate(),
    };

    return {
      uid: player.uid,
      from: firebase.getTimestamp(set(player.from.toDate(), updatedValues)),
      until: firebase.getTimestamp(set(player.until.toDate(), updatedValues)),
    };
  });

const UpdateMatch: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
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

  const [games, gamesLoading] = useCollectionData<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
    { idField: 'id' },
  );

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
      date: firebase.getTimestamp(date),
      description,
      game: firebase.firestore.doc(`games/${gameId}`),
      players: updatePlayerList(match.players, date),
    };

    firebase.firestore
      .collection('matches')
      .doc(match.id)
      .update(updatedMatch)
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
                  disabled={!games || loading}
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
