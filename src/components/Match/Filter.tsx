import React, { Dispatch, SetStateAction } from 'react';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import firebase from '../../api/firebase';
import { Game, GameID } from '../../types';
import { theme } from '../../styles/theme';

export type MatchFilter = {
  games: GameID[];
};

type Props = {
  setFilter: Dispatch<SetStateAction<MatchFilter>>;
};

const Filter: React.FC<Props> = ({ setFilter }) => {
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
          filterSelectedOptions
          multiple
          disabled={gamesLoading}
          getOptionLabel={option => option.name}
          loading={gamesLoading}
          onChange={(_event, games) =>
            setFilter({
              games: games.map(game => game.id),
            })
          }
          options={options}
          size="small"
          renderInput={props => (
            <TextField
              {...props}
              variant="outlined"
              placeholder="Spielefilter"
              disabled={gamesLoading}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Filter;
