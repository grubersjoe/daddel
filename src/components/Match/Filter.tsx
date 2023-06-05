import { Autocomplete, Grid, TextField } from '@mui/material';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';

import { useGamesCollectionData } from '../../hooks/useGamesCollectionData';
import { Game } from '../../types';
import { STORAGE_KEY, setStorageItem } from '../../utils/local-storage';

export type MatchFilter = {
  games: Array<Game>;
};

type Props = {
  filter: MatchFilter;
  setFilter: Dispatch<SetStateAction<MatchFilter>>;
};

const Filter: FunctionComponent<Props> = ({ filter, setFilter }) => {
  const [games, gamesLoading, gamesError] = useGamesCollectionData();
  const options = games ?? [];

  if (gamesError) {
    return null;
  }

  return (
    <Grid container spacing={5} sx={{ mt: -2, mb: 2 }}>
      <Grid item xs={12} lg={4}>
        <Autocomplete<Game, true>
          clearOnEscape
          disabled={gamesLoading}
          filterSelectedOptions
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(a, b) => a.name === b.name}
          multiple
          loading={gamesLoading}
          onChange={(_event, games) => {
            setFilter({ games });
            setStorageItem(STORAGE_KEY.MATCH_FILTER, { games });
          }}
          options={options}
          renderInput={props => (
            <TextField
              {...props}
              variant="outlined"
              placeholder="Filter"
              disabled={gamesLoading}
            />
          )}
          size="small"
          value={filter.games}
        />
      </Grid>
    </Grid>
  );
};

export default Filter;
