import React, { useState, FormEventHandler } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import setMinutes from 'date-fns/setMinutes';
import setHours from 'date-fns/setHours';

import firebase from '../api';
import { Match } from '../types';

const AddMatch: React.FC<RouteComponentProps> = ({ history }) => {
  const defaultDate = setMinutes(setHours(new Date(), 18), 30);

  const [date, setDate] = useState<Date | null>(defaultDate);
  const [maxPlayers, setMaxPlayers] = useState<number>(5);
  const [description, setDescription] = useState<string>('');

  const [error, setError] = useState<Error | null>(null);

  const addMatch: FormEventHandler = event => {
    event.preventDefault();

    if (!date) {
      setError(new Error('Date is not set'));
      return;
    }

    const { currentUser } = firebase.auth;

    const matchData: Match = {
      date,
      maxPlayers,
      players: [],
      description,
      created: new Date(),
      createdBy: currentUser?.uid || 'unknown',
    };

    firebase.db
      .collection('matches')
      .add(matchData)
      .then(doc => {
        console.log(`${doc.id} written`);
        history.push('/matches');
      })
      .catch(setError);
  };

  return (
    <Container>
      <h1>Neuer Bolz</h1>
      <form autoComplete="off" onSubmit={addMatch}>
        <Box my="2rem">
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
            <DateTimePicker
              label="Datum und Uhrzeit"
              name="date"
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
        <Box my="2rem">
          <TextField
            label="Lobbygröße"
            name="maxPlayers"
            type="number"
            defaultValue={maxPlayers}
            onChange={event => setMaxPlayers(Number(event.target.value))}
            variant="outlined"
            required
            fullWidth
          />
        </Box>
        <Box my="2rem">
          <TextField
            label="Beschreibung (optional)"
            name="maxPlayers"
            defaultValue={description}
            onChange={event => setDescription(event.target.value)}
            variant="outlined"
            multiline
            rows={3}
            fullWidth
          />
        </Box>
        <Box my="2rem">
          <Button variant="contained" color="primary" type="submit">
            Bolz hinzufügen
          </Button>
        </Box>
      </form>
      {error && <p>Fehler!</p>}
    </Container>
  );
};

export default withRouter(AddMatch);
