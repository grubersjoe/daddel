import React, { useState, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { User } from 'firebase';
import addHours from 'date-fns/addHours';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';

import firebase from '../api/firebase';
import { joinMatch } from '../api/match';
import { MATCH_TIME_END, TIME_FORMAT } from '../constants/time';
import { Match } from '../types';
import AuthUserContext from '../components/AuthUserContext';

const AddMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const defaultDate = setMinutes(setHours(new Date(), 18), 30);

  const [date, setDate] = useState<Date | null>(defaultDate);
  const [maxPlayers, setMaxPlayers] = useState(5); // eslint-disable-line
  const [description, setDescription] = useState('');
  const [joinLobby, setJoinLobby] = useState(true);

  const [error, setError] = useState<Error | null>(null);

  const addMatch = (event: FormEvent, currentUser: User) => {
    event.preventDefault();

    if (!date) {
      setError(new Error('Date is not set'));
      return;
    }

    const match: Match = {
      date: firebase.timestamp(date),
      maxPlayers,
      players: [],
      description,
      created: firebase.timestamp(),
      createdBy: currentUser.uid,
    };

    firebase.firestore
      .collection('matches')
      .add(match)
      .then(doc => {
        if (joinLobby) {
          const availFrom = format(date, TIME_FORMAT);
          const availUntil = isSameDay(addHours(date, 2), date)
            ? format(addHours(date, 2), TIME_FORMAT)
            : MATCH_TIME_END;

          joinMatch({
            availFrom,
            availUntil,
            currentPlayers: [],
            match: { ...match, id: doc.id } as Required<Match>,
          })
            .then(() => history.push('/matches'))
            .catch(setError);
        } else {
          history.push('/matches');
        }
      })
      .catch(setError);
  };

  if (error) console.error(error);

  return (
    <Container>
      <h1>Neuer Bolz</h1>
      <AuthUserContext.Consumer>
        {user =>
          user && (
            <form autoComplete="off" onSubmit={event => addMatch(event, user)}>
              <Box my="2rem">
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
              {/* <Box my="2rem">
                <TextField
                  label="Lobbygröße"
                  type="number"
                  defaultValue={maxPlayers}
                  onChange={event => setMaxPlayers(Number(event.target.value))}
                  disabled
                  required
                  fullWidth
                />
              </Box> */}
              <Box my="2rem" marginY="1rem">
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
              <Box my="2rem">
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
          )
        }
      </AuthUserContext.Consumer>
      {error && <p>Fehler!</p>}
    </Container>
  );
};

export default withRouter(AddMatch);
