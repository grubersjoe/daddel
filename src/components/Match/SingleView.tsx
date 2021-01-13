import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import firebase from '../../services/firebase';
import { UserMap, Match } from '../../types';
import MatchCard from './MatchCard';
import Spinner from '../Spinner';

type Props = {
  userList?: UserMap;
};

const SingleView: React.FC<Props> = ({ userList }) => {
  const { match: matchId } = useParams<{ match: string }>();

  const [match, loading, error] = useDocumentData<Match>(
    firebase.firestore.doc(`matches/${matchId}`),
    { idField: 'id' },
  );

  if (!userList || loading) {
    return <Spinner />;
  }

  if ((!loading && !match) || error) {
    return <Alert severity="error">Match konnte nicht geladen werden :(</Alert>;
  }

  if (!match) {
    return null;
  }

  return (
    <Box p={3} pt={0}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4} lg={3} key={match.id}>
          <MatchCard match={match} userList={userList} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SingleView;
