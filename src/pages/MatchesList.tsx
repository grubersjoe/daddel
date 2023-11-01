import { Alert, Button, Container, Grid, Typography } from '@mui/material';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { FunctionComponent, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import MatchCard from '../components/Match/MatchCard';
import PageMetadata from '../components/PageMetadata';
import routes from '../constants/routes';
import useCurrentDate from '../hooks/useCurrentDate';
import useFetchUsers from '../hooks/useFetchUsers';
import { futureMatchesQuery } from '../queries/matches';
import { Match } from '../types';
import { getCollectionRef } from '../services/firebase';

export const gridConfig = {
  xs: 12,
  sm: 12 / 2,
  md: 12 / 3,
  lg: 12 / 4,
  xl: 12 / 5,
} as const;

const MatchesList: FunctionComponent = () => {
  const [users] = useFetchUsers();

  const [, setIsRefetching] = useState(false);

  const currentDate = useCurrentDate();

  const [matches, , matchesError] = useCollectionData<Match>(
    query(
      getCollectionRef('matches'),
      where('date', '>=', currentDate),
      orderBy('date', 'asc'),
    ),
    {
      idField: 'id',
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    },
  );

  onSnapshot(futureMatchesQuery(currentDate), doc =>
    setIsRefetching(doc.metadata.fromCache || doc.metadata.hasPendingWrites),
  );

  return (
    <>
      <PageMetadata title="Matches – Daddel" />
      <SetupUserDialog />

      <AppBar title="Matches" />

      <Container maxWidth={false} sx={{ my: 1 }}>
        {!matches && <p>Lade …</p>}

        {matchesError && (
          <Alert severity="error">Fehler: {matchesError.message}</Alert>
        )}

        {matches && matches.length > 0 && users && (
          <Grid container spacing={5}>
            {matches.map(match => (
              <Grid item {...gridConfig} key={match.id}>
                <MatchCard match={match} userList={users} />
              </Grid>
            ))}
          </Grid>
        )}

        {matches && matches.length === 0 && (
          <>
            <Typography paragraph>Wow. Much empty.</Typography>
            <Button
              color="primary"
              component={Link}
              to={routes.addMatch}
              sx={{ mt: 1 }}
            >
              Neues Match
            </Button>
          </>
        )}
      </Container>
    </>
  );
};

export default MatchesList;
