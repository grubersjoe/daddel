import React, { Dispatch, SetStateAction } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import firebase from '../../api/firebase';
import { Game } from '../../types';
import { theme } from '../../styles/theme';
import { setStorageItem, STORAGE_KEYS } from '../../utils/local-storage';

export type MatchFilter = {
  games: Game[];
};

type Props = {
  filter: MatchFilter;
  setFilter: Dispatch<SetStateAction<MatchFilter>>;
};

const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  const [games, gamesLoading, gamesError] = useCollectionDataOnce<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
  );

  const options = games || [];

  if (gamesError) {
    console.error(gamesError);
    return null;
  }

  return (
    <Grid container spacing={5} style={{ marginBottom: theme.spacing(1) }}>
      <Grid item xs={12} lg={4}>
        <Autocomplete<Game>
          clearOnEscape
          disabled={gamesLoading}
          filterSelectedOptions
          getOptionLabel={option => option.name}
          loading={gamesLoading}
          multiple
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
