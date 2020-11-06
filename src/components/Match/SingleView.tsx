import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

import firebase from '../../api/firebase';
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
    <Grid container spacing={5} style={{ width: '100%', padding: '0 24px' }}>
      <Grid item xs={12} md={4} lg={3} key={match.id}>
        <MatchCard match={match} userList={userList} />
      </Grid>
    </Grid>
  );
};

export default SingleView;
