import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import isValid from 'date-fns/isValid';
import setDate from 'date-fns/set';
import { Timestamp, updateDoc } from 'firebase/firestore';
import React, {
  FormEvent,
  Reducer,
  useContext,
  useReducer,
  useState,
} from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SteamAuthentication from '../components/Auth/SteamAuthentication';
import DateTimePicker from '../components/DateTimePicker';
import { SnackbarContext } from '../components/Layout';
import GameSelect, { GameOption } from '../components/Match/GameSelect';
import PageMetadata from '../components/PageMetadata';
import routes from '../constants/routes';
import { useSteamUser } from '../hooks/useSteamUser';
import { getDocRef } from '../services/firebase';
import { Match, Player } from '../types';
import { isSteamGame } from '../types/guards';

type Actions =
  | { type: 'set_game'; game: GameOption | null }
  | { type: 'set_date'; date: Date }
  | { type: 'set_max_players'; maxPlayers: string }
  | { type: 'set_description'; description: string };

const reducer: Reducer<Match, Actions> = (state, action) => {
  switch (action.type) {
    case 'set_game': {
      return {
        ...state,
        game: {
          ...state.game,
          name: action.game ? action.game.name.trim() : '',
          steamAppId:
            action.game && isSteamGame(action.game) ? action.game.appid : null,
        },
      };
    }
    case 'set_date': {
      return {
        ...state,
        date: Timestamp.fromDate(action.date),
        players: updatePlayerDates(state.players, action.date),
      };
    }
    case 'set_max_players': {
      return {
        ...state,
        game: {
          ...state.game,
          maxPlayers: action.maxPlayers ? Number(action.maxPlayers) : null,
        },
      };
    }
    case 'set_description': {
      return {
        ...state,
        description: action.description ?? null,
      };
    }
    default:
      return state;
  }
};

const EditMatch = () => {
  const { id } = useParams<{ id: string }>();
  const [match, loading, error] = useDocumentDataOnce<Match>(
    getDocRef('matches', id),
    { idField: 'id' },
  );

  const dispatchSnack = useContext(SnackbarContext);

  if (loading) {
    return null;
  }

  if (error) {
    dispatchSnack(`Match konnte nicht gespeichert werden`, 'error');
    return <Navigate to={routes.matchList} />;
  }

  if (!match) {
    dispatchSnack(`Match nicht gefunden`, 'warning');
    return <Navigate to={routes.matchList} />;
  }

  return (
    <>
      <PageMetadata title="Match bearbeiten – Daddel" />
      <AppBar title="Match bearbeiten" />
      <Container>
        <EditForm match={match} />
      </Container>
    </>
  );
};

const EditForm = (props: { match: Match }) => {
  const navigate = useNavigate();
  const dispatchSnack = useContext(SnackbarContext);

  const { data: steamUser } = useSteamUser();

  const [match, dispatch] = useReducer(reducer, props.match);
  const [loading, setLoading] = useState(false);

  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    updateDoc<Match>(getDocRef('matches', match.id), match)
      .then(() => {
        dispatchSnack('Match aktualisiert');
        navigate(routes.matchList);
      })
      .catch(() =>
        dispatchSnack('Match konnte nicht bearbeitet werden', 'error'),
      )
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Box mt={2} mb={3}>
        <GameSelect
          defaultValue={match.game}
          onChange={game => {
            dispatch({ type: 'set_game', game });
          }}
        />
      </Box>

      <form autoComplete="off" onSubmit={handleUpdate}>
        <Box mb={3}>
          <DateTimePicker
            date={match.date.toDate()}
            onChange={date => {
              if (date) {
                dispatch({ type: 'set_date', date });
              }
            }}
          />
        </Box>
        <Box mb={3}>
          <TextField
            type="number"
            label="Anzahl Spieler"
            inputProps={{
              inputMode: 'numeric',
              min: 2,
              max: 50,
            }}
            value={String(match.game.maxPlayers ?? '')}
            onChange={event => {
              dispatch({
                type: 'set_max_players',
                maxPlayers: event.target.value,
              });
            }}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Beschreibung (optional)"
            value={match.description ?? ''}
            onChange={event =>
              dispatch({
                type: 'set_description',
                description: event.target.value,
              })
            }
            multiline
            rows={3}
            variant="outlined"
            fullWidth
          />
        </Box>

        {!steamUser && (
          <Box mt={2} mb={5}>
            <Typography variant="body1" color="textSecondary" mb={2}>
              Melde dich bei Steam an, um all deine verfügbaren Spiele
              anzuzeigen.
            </Typography>
            <SteamAuthentication />
          </Box>
        )}

        <Box my={3} sx={{ display: 'flex', gap: 2, justifyContent: 'end' }}>
          <Button onClick={() => window.history.go(-1)} disabled={loading}>
            Abbrechen
          </Button>

          <Button
            type="submit"
            color="primary"
            disabled={!match.game.name || !isValid(match.date) || loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={22} thickness={3} />
              ) : null
            }
          >
            Speichern
          </Button>
        </Box>
      </form>
    </>
  );
};

const updatePlayerDates = (
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

export default EditMatch;
