import React, { useState, FormEvent } from 'react';
import { StaticContext } from 'react-router';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import firebase from '../api/firebase';
import { DEFAULT_GAME } from '../constants';
import * as ROUTES from '../constants/routes';
import { Match, Game, GameID } from '../types';

const EditMatch: React.FC<RouteComponentProps<
  {},
  StaticContext,
  { match: Match }
>> = ({ location, history }) => {
  // Matches are passed as state through the <Link> component of react-router.
  // If this page is opened directly location.state will be undefined.
  const match = location?.state?.match;

  const [gameID, setGameID] = useState<Game['id']>(match?.game || DEFAULT_GAME);
  const [date, setDate] = useState<Date | null>(match?.date.toDate());
  const [description, setDescription] = useState(match?.description);

  const [error, setError] = useState<Error | null>(null);

  const [games, gamesLoading, gamesError] = useCollectionDataOnce<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
  );

  if (!match) {
    history.push(ROUTES.MATCHES_LIST);
    return null;
  }

  if (gamesError) console.error(gamesError);
  if (error) console.error(error);

  const editMatch = (event: FormEvent) => {
    event.preventDefault();

    if (!date) {
      throw new Error('Date is not set');
    }

    const updatedMatch = {
      date: firebase.timestamp(date),
      description,
      game: gameID,
    };

    firebase.firestore
      .collection('matches')
      .doc(match.id)
      .set(updatedMatch, { merge: true })
      .then(() => history.push(ROUTES.MATCHES_LIST))
      .catch(setError);
  };

  return (
    <Container>
      <h1>Bolz bearbeiten</h1>

      <Box my="1.5rem">
        <Select
          value={gameID}
          onChange={event => setGameID(event.target.value as GameID)}
          variant="outlined"
          disabled={gamesLoading}
          fullWidth
          native
        >
          {gamesLoading && <option>Lade ...</option>}
          {games &&
            games.map(game => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
        </Select>
      </Box>

      <form autoComplete="off" onSubmit={editMatch}>
        <Box my="1.5rem">
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
            <DateTimePicker
              label="Datum und Uhrzeit"
              variant="dialog"
              inputVariant="outlined"
              value={date}
              onChange={setDate}
              minutesStep={15}
              ampm={false}
              required
              fullWidth
            />
          </MuiPickersUtilsProvider>
        </Box>
        <Box my="1.5rem" marginY="1rem">
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
                fullWidth
              >
                Jajaja!
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>

      {error && <p>Fehler!</p>}
    </Container>
  );
};

export default withRouter(EditMatch);
