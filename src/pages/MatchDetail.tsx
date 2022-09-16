import LinkIcon from '@mui/icons-material/Link';
import { Box, Button, Grid } from '@mui/material';
import React, { FunctionComponent, useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Link, Navigate, useParams } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import { SnackbarContext } from '../components/Layout';
import MatchCard from '../components/Match/MatchCard';
import Spinner from '../components/Spinner';
import routes from '../constants/routes';
import useFetchUsers from '../hooks/useFetchUsers';
import { getDocRef } from '../services/firebase';
import { Match } from '../types';

const MatchDetail: FunctionComponent = () => {
  const dispatchSnack = useContext(SnackbarContext);
  const { id } = useParams<{ id: string }>();

  const [match, loading, error] = useDocumentData<Match>(
    getDocRef('matches', id),
    { idField: 'id' },
  );

  const [users] = useFetchUsers();

  if (!users || loading) {
    return <Spinner />;
  }

  if ((!loading && !match) || error) {
    dispatchSnack(`Angefragtes Match nicht gefunden`, 'error');

    return <Navigate to={routes.matchList} />;
  }

  if (!match) {
    return null;
  }

  return (
    <>
      <SetupUserDialog />
      <AppBar>
        <>
          <Button variant="text" component={Link} to={routes.matchList}>
            Alle Matches
          </Button>
          <Button
            variant="text"
            startIcon={<LinkIcon />}
            sx={{ ml: '1rem' }}
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard
                  .writeText(`${window.location.origin}/matches/${match.id}`)
                  .then(() => {
                    dispatchSnack('In Zwischenablage kopiert');
                  });
              } else {
                dispatchSnack('Aktion nicht unterstützt', 'error');
              }
            }}
          >
            Link kopieren
          </Button>
        </>
      </AppBar>
      <Box p={3} pt={0}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4} lg={3} key={match.id}>
            <MatchCard match={match} userList={users} setPageMetadata />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MatchDetail;
