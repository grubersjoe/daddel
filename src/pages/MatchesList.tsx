import { Alert, Button, Container, Grid, Typography } from '@mui/material';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { FunctionComponent, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import MatchCard from '../components/Match/MatchCard';
import PageMetadata from '../components/PageMetadata';
import routes from '../constants/routes';
import useToday from '../hooks/useToday';
import { firestore } from '../services/firebase';
import { matchConverter } from '../services/firestore';
import { Match } from '../types';

export const gridConfig = {
  xs: 12,
  sm: 12 / 2,
  md: 12 / 3,
  lg: 12 / 4,
  xl: 12 / 5,
} as const;

const MatchesList: FunctionComponent = () => {
  const [, setIsRefetching] = useState(false);

  const today = useToday();
  const matchQuery = query(
    collection(firestore, 'matches').withConverter(matchConverter),
    where('date', '>=', today),
    orderBy('date', 'asc'),
  );

  const [matches, , matchesError] = useCollectionData<Match>(matchQuery, {
    snapshotListenOptions: {
      includeMetadataChanges: true,
    },
  });

  onSnapshot(matchQuery, doc => {
    setIsRefetching(doc.metadata.fromCache || doc.metadata.hasPendingWrites);
  });

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

        {matches && matches.length > 0 ? (
          <Grid container spacing={5}>
            {matches.map(match => (
              <Grid item {...gridConfig} key={match.id}>
                <MatchCard match={match} />
              </Grid>
            ))}
          </Grid>
        ) : (
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
