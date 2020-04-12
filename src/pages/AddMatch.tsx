import React, { useState, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { User } from 'firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import addHours from 'date-fns/addHours';
import isSameDay from 'date-fns/isSameDay';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';

import firebase from '../api/firebase';
import { joinMatch } from '../api/match';
import { DEFAULT_GAME } from '../constants';
import { Match, Game, GameID, TimeLabel } from '../types';
import {
  DEFAULT_MATCH_STARTTIME,
  MATCH_TIME_END,
  TIME_FORMAT,
} from '../constants/date';
import { format } from '../utils/date';
import AppBar from '../components/AppBar';
import AuthUserContext from '../components/AuthUserContext';

const AddMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [defaultHour, defaultMinute] = DEFAULT_MATCH_STARTTIME.split(':');
  const defaultDate = setMinutes(
    setHours(new Date(), Number(defaultHour)),
    Number(defaultMinute),
  );

  const [gameID, setGameID] = useState<Game['id']>(DEFAULT_GAME);
  const [date, setDate] = useState<Date | null>(defaultDate); // null because of MUI
  const [description, setDescription] = useState('');
  const [joinLobby, setJoinLobby] = useState(true);

  const [games, gamesLoading, gamesError] = useCollectionDataOnce<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
  );

  if (gamesError) console.error(gamesError);
  if (error) console.error(error);

  const addMatch = (event: FormEvent, currentUser: User) => {
    event.preventDefault();
    setLoading(true);

    if (!date) throw new Error('Date is not set.');
    if (!games) throw new Error('Games are not loaded yet.');

    const maxPlayers = games.find(game => game.id === gameID)?.maxPlayers;
    const match: Match = {
      created: firebase.timestamp(),
      createdBy: currentUser.uid,
      date: firebase.timestamp(date),
      description,
      game: gameID,
      players: [],
      ...(maxPlayers && { maxPlayers }), // set maxPlayers only if set
    };

    firebase.firestore
      .collection('matches')
      .add(match)
      .then(doc => {
        if (joinLobby) {
          const availFrom = format(date, TIME_FORMAT) as TimeLabel;
          const availUntil = isSameDay(addHours(date, 2), date)
            ? format<TimeLabel>(addHours(date, 2), TIME_FORMAT)
            : MATCH_TIME_END;

          joinMatch(availFrom, availUntil, { id: doc.id, ...match })
            .then(() => history.push('/matches'))
            .catch(setError)
            .finally(() => setLoading(false));
        } else {
          history.push('/matches');
          setLoading(false);
        }
      })
      .catch(setError);
  };

  return (
    <>
      <AppBar title="Neuer Bolz" />
      <Container>
        <Box mb="1.5rem">
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

        <AuthUserContext.Consumer>
          {user =>
            user && (
              <form
                autoComplete="off"
                onSubmit={event => addMatch(event, user)}
              >
                <Box mb="1.5rem">
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={deLocale}
                  >
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={joinLobby}
                      onChange={event => setJoinLobby(event.target.checked)}
                    />
                  }
                  label="Selbst mitbolzen"
                />
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
                        Jajaja!
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            )
          }
        </AuthUserContext.Consumer>

        {error && <Alert severity="error">Fehler: {error.message}</Alert>}
      </Container>
    </>
  );
};

export default withRouter(AddMatch);
