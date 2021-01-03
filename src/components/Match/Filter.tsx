import React, { Dispatch, SetStateAction } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useTheme } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import firebase from '../../services/firebase';
import { Game } from '../../types';
import { setStorageItem, STORAGE_KEYS } from '../../utils/local-storage';

export type MatchFilter = {
  games: Array<Game>;
};

type Props = {
  filter: MatchFilter;
  setFilter: Dispatch<SetStateAction<MatchFilter>>;
};

const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  const theme = useTheme();

  const [games, gamesLoading, gamesError] = useCollectionData<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
    { idField: 'id' },
  );

  const options = games ?? [];

  if (gamesError) {
    return null;
  }

  return (
    <Grid container spacing={5} style={{ marginBottom: theme.spacing(1) }}>
      <Grid item xs={12} lg={4}>
        <Autocomplete<Game, true>
          clearOnEscape
          disabled={gamesLoading}
          filterSelectedOptions
          getOptionLabel={option => option.name}
          getOptionSelected={(a, b) => a.id === b.id}
          multiple
          loading={gamesLoading}
          onChange={(_event, games) => {
            setFilter({ games });
            setStorageItem(STORAGE_KEYS.matchFilter, { games });
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
