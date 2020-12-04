import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Redirect, StaticContext } from 'react-router';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isSameDay from 'date-fns/isSameDay';
import set from 'date-fns/set';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import firebase from '../api/firebase';
import ROUTES from '../constants/routes';
import { reorderGames } from '../utils';
import { Match, Game, Player } from '../types';
import AppBar from '../components/AppBar';
import { SnackbarContext } from '../components/Layout';

type LocationState = {
  game: Omit<Game, 'gameRef'>;
  match: Match;
};

const updatePlayerDates = (players: Player[], updatedDate: Date): Player[] =>
  players.map(player => {
    const fromDate = player.from.toDate();
    const untilDate = player.until.toDate();

    const from = isSameDay(fromDate, updatedDate)
      ? player.from
      : firebase.timestamp(
          set(fromDate, {
            year: getYear(updatedDate),
            month: getMonth(updatedDate),
            date: getDate(updatedDate),
          }),
        );

    const until = isSameDay(untilDate, updatedDate)
      ? player.until
      : firebase.timestamp(
          set(untilDate, {
            year: getYear(updatedDate),
            month: getMonth(updatedDate),
            date: getDate(updatedDate),
          }),
        );

    return {
      uid: player.uid,
      from,
      until,
    };
  });

const EditMatch: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = ({ location, history }) => {
  const dispatchSnack = useContext(SnackbarContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // The Game and Match are passed as state through the <Link> component of react-router.
  // If this page is opened directly location.state will be undefined.
  const game = location?.state?.game;
  const match = location?.state?.match;

  const [gid, setGid] = useState<Game['gid']>();
  const [date, setDate] = useState<Date | null>(); // null because of MUI
  const [description, setDescription] = useState<string>();

  useEffect(() => {
    if (game && match) {
      setGid(game.gid);
      setDate(match.date.toDate());
      setDescription(match.description);
    }
  }, [game, match]);

  const [games, gamesLoading, gamesError] = useCollectionData<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
    { idField: 'gid' },
  );

  if (gamesError) {
    setError(gamesError);
  }

  // Hooks must not be called conditionally.
  // So bailing out is not possible earlier.
  if (!game || !match) {
    return <Redirect to={ROUTES.MATCHES_LIST} />;
  }

  const editMatch = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!date) {
      throw new Error('Date is not set');
    }

    const updatedMatch = {
      date: firebase.timestamp(date),
      description: description,
      gameRef: firebase.firestore.doc(`games/${gid}`),
      players: updatePlayerDates(match.players, date),
    };

    firebase.firestore
      .collection('matches')
      .doc(match.id)
      .set(updatedMatch, { merge: true })
      .then(() => {
        dispatchSnack('Match aktualisiert');
        history.push(ROUTES.MATCHES_LIST);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <>
      <AppBar title="Match bearbeiten" />
      <Container>
        <Box mb="1.5rem">
          <Select
            value={gid}
            onChange={event => setGid(String(event.target.value))}
            variant="outlined"
            disabled={gamesLoading}
            fullWidth
            native
          >
            {gamesLoading && <option>Lade …</option>}
            {games &&
              reorderGames(games).map(game => (
                <option key={game.gid} value={game.gid}>
                  {game.name}
                </option>
              ))}
          </Select>
        </Box>

        <form
          autoComplete="off"
          onSubmit={editMatch}
          onChange={() => setError(null)}
        >
          <Box mb="1.5rem">
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
              <DateTimePicker
                label="Datum und Uhrzeit"
                variant="dialog"
                inputVariant="outlined"
                value={date}
                onChange={setDate}
                minutesStep={15}
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

        {error && <Alert severity="error">Fehler: {error.message}</Alert>}
      </Container>
    </>
  );
};

export default withRouter(EditMatch);
