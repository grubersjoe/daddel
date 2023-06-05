import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';

import { SteamGame, useSteamGames } from '../../hooks/useSteamGames';

interface Props {
  defaultValue?: GameOption;
  onChange: (game: GameOption | null) => void;
}

export type GameOption = SteamGame | { name: string };

const GameSelect = (props: Props) => {
  const { data: games, isLoading: gamesLoading } = useSteamGames();
  const [value, setValue] = useState<GameOption | null>(
    props.defaultValue ?? null,
  );

  return (
    <MuiAutocomplete<GameOption, false, false, true>
      freeSolo
      options={games ?? []}
      value={value}
      onChange={(event, option) => {
        const value = typeof option === 'string' ? { name: option } : option;
        setValue(value);
        props.onChange(value);
      }}
      onInputChange={(event, newValue) => {
        setValue({ name: newValue });
        props.onChange({ name: newValue });
      }}
      getOptionLabel={option => {
        if (typeof option === 'string') {
          return option;
        }

        return option.name;
      }}
      selectOnFocus
      handleHomeEndKeys
      renderInput={props => (
        <TextField {...props} label="Spiel" disabled={gamesLoading} required />
      )}
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      disabled={gamesLoading}
      loading={gamesLoading}
    />
  );
};

export default GameSelect;
