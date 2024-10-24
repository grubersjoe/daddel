import ArrowBack from '@mui/icons-material/ArrowBack';
import { Button, Container, Grid } from '@mui/material';
import { useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Link, Navigate, useParams } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import { SnackbarContext } from '../components/Layout';
import MatchCard from '../components/Match/MatchCard';
import Spinner from '../components/Spinner';
import routes from '../constants/routes';
import { getMatchRef } from '../services/firestore';
import { gridConfig } from './MatchesList';

const MatchDetail = () => {
  const dispatchSnack = useContext(SnackbarContext);
  const { id } = useParams<{ id: string }>();
  const [match, loading, error] = useDocumentData(id ? getMatchRef(id) : null);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    dispatchSnack(`Fehler`, 'error');
    return <Navigate to={routes.matchList} />;
  }

  if (!match) {
    dispatchSnack(`Angefragtes Match nicht gefunden`, 'error');
    return <Navigate to={routes.matchList} />;
  }

  return (
    <>
      <SetupUserDialog />
      <AppBar>
        <>
          <Button
            variant="text"
            component={Link}
            to={routes.matchList}
            startIcon={<ArrowBack />}
          >
            Übersicht
          </Button>
        </>
      </AppBar>

      <Container maxWidth={false} sx={{ my: 1 }}>
        <Grid container spacing={5}>
          <Grid item {...gridConfig} key={match.id}>
            <MatchCard match={match} setPageMetadata />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MatchDetail;
