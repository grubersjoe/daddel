import { set } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { Reducer, useReducer } from 'react';

import { GameOption, Match, Player, isSteamGame } from '../types';

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
        description: action.description,
      };
    }
    default:
      return state;
  }
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
      from: Timestamp.fromDate(set(player.from.toDate(), updateDate)),
      until: Timestamp.fromDate(set(player.until.toDate(), updateDate)),
    };
  });

export const useUpdateMatch = (initialMatch: Match) =>
  useReducer(reducer, initialMatch);
