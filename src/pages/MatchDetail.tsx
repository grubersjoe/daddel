import React, { useContext } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinkIcon from '@material-ui/icons/Link';

import ROUTES from '../constants/routes';
import useUserList from '../hooks/useUserList';
import firebase from '../services/firebase';
import { Match } from '../types';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import MatchCard from '../components/Match/MatchCard';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import Spinner from '../components/Spinner';

const MatchDetail: React.FC = () => {
  const dispatchSnack = useContext(SnackbarContext);

  const { match: matchId } = useParams<{ match: string }>();

  const [match, loading, error] = useDocumentData<Match>(
    firebase.firestore.doc(`matches/${matchId}`),
    { idField: 'id' },
  );

  const [userList] = useUserList();

  if (!userList || loading) {
    return <Spinner />;
  }

  if ((!loading && !match) || error) {
    dispatchSnack(`Angefragtes Match nicht gefunden`, 'error');

    return <Redirect to={ROUTES.MATCHES_LIST} />;
  }

  if (!match) {
    return null;
  }

  return (
    <>
      <SetupUserDialog />
      <AppBar>
        <>
          <Button variant="text" component={Link} to={ROUTES.MATCHES_LIST}>
            Alle Matches
          </Button>
          <Button
            variant="text"
            startIcon={<LinkIcon />}
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
            style={{ marginLeft: '1rem' }}
          >
            Link kopieren
          </Button>
        </>
      </AppBar>
      <Box p={3} pt={0}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4} lg={3} key={match.id}>
            <MatchCard match={match} userList={userList} setPageMetadata />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MatchDetail;
