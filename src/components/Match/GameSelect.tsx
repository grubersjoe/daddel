import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';

import { useSteamApps } from '../../hooks/useSteamApps';
import { GameOption } from '../../types';

interface Props {
  defaultValue?: GameOption;
  onChange: (game: GameOption | null) => void;
}

const GameSelect = (props: Props) => {
  const { data: games, isLoading: gamesLoading } = useSteamApps();
  const [value, setValue] = useState<GameOption | null>(
    props.defaultValue ?? null,
  );

  function handleChange(option: string | GameOption | null) {
    const value = typeof option === 'string' ? { name: option } : option;
    setValue(value);
    props.onChange(value);
  }

  return (
    <MuiAutocomplete<GameOption, false, false, true>
      freeSolo
      options={games ?? []}
      value={value}
      onChange={(_, option) => {
        handleChange(option);
      }}
      onInputChange={(_, option, reason) => {
        if (reason === 'input') {
          handleChange(option);
        }
      }}
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.name
      }
      handleHomeEndKeys
      renderInput={props => <TextField {...props} label="Spiel" required />}
      loading={gamesLoading}
    />
  );
};

export default GameSelect;
