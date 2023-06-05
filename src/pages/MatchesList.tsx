import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Alert, Box, Button, Grid, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import { onSnapshot } from 'firebase/firestore';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import AppBar from '../components/AppBar';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import Filter, { MatchFilter } from '../components/Match/Filter';
import MatchCard from '../components/Match/MatchCard';
import MatchCardSkeleton from '../components/Match/MatchCardSkeleton';
import PageMetadata from '../components/PageMetadata';
import { MAX_SHOWN_PAST_MATCHES } from '../constants';
import routes from '../constants/routes';
import useCurrentDate from '../hooks/useCurrentDate';
import useFetchUsers from '../hooks/useFetchUsers';
import { futureMatchesQuery, pastMatchesQuery } from '../queries/matches';
import { Match } from '../types';
import { filterMatches } from '../utils/filter';
import {
  STORAGE_KEY,
  getStorageItem,
  setStorageItem,
} from '../utils/local-storage';

const loadingAnimation =
  'pulse 0.75s cubic-bezier(.46,.03,.52,.96) 0s infinite';

const MatchesList: FunctionComponent = () => {
  const [users] = useFetchUsers();

  const [isRefetching, setIsRefetching] = useState(false);
  const [tabNumber, setTabNumber] = useState<'1' | '2'>('1');

  const currentDate = useCurrentDate();

  const [futureMatches, , futureMatchesError] = useCollectionData<Match>(
    futureMatchesQuery(currentDate),
    {
      idField: 'id',
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    },
  );

  const [pastMatches, , pastMatchesError] = useCollectionData<Match>(
    pastMatchesQuery(currentDate, MAX_SHOWN_PAST_MATCHES),
    { idField: 'id' },
  );

  onSnapshot(futureMatchesQuery(currentDate), doc =>
    setIsRefetching(doc.metadata.fromCache || doc.metadata.hasPendingWrites),
  );

  const [showFilter, setShowFilter] = useState(
    getStorageItem<boolean>(STORAGE_KEY.MATCH_FILTER_ENABLED) ?? false,
  );

  const [filter, setFilter] = useState<MatchFilter>(
    getStorageItem<MatchFilter>(STORAGE_KEY.MATCH_FILTER) ?? { games: [] },
  );

  const filteredFutureMatches = useMemo(
    () => (futureMatches ? filterMatches(futureMatches, filter) : null),
    [futureMatches, filter],
  );

  const filteredPastMatches = useMemo(
    () => (pastMatches ? filterMatches(pastMatches, filter) : null),
    [pastMatches, filter],
  );

  const numberOfEnabledFilters = filter.games.length;
  const filterConfig = {
    color: showFilter ? 'primary' : 'inherit',
    enabled: numberOfEnabledFilters,
    title: showFilter ? 'Filter verstecken' : 'Filter anzeigen',
    onClick: () => {
      setShowFilter(enabled => {
        setStorageItem(STORAGE_KEY.MATCH_FILTER_ENABLED, !enabled);
        return !enabled;
      });
    },
  } as const;

  return (
    <>
      <PageMetadata title="Matches – Daddel" />
      <SetupUserDialog />

      <AppBar filter={filterConfig}>
        <TabContext value={tabNumber}>
          <TabList
            value={tabNumber}
            onChange={(_event, index) => setTabNumber(index)}
            variant="fullWidth"
          >
            <Tab
              label="Anstehende"
              value="1"
              sx={{
                ...(isRefetching && { animation: loadingAnimation }),
                minHeight: 64,
              }}
            />
            <Tab value="2" label="Vergangene" />
          </TabList>
        </TabContext>
      </AppBar>

      {showFilter && (
        <Box px={3}>
          <Filter filter={filter} setFilter={setFilter} />
        </Box>
      )}

      <TabContext value={tabNumber}>
        <TabPanel value="1">
          {futureMatchesError && (
            <Alert severity="error">Fehler: {futureMatchesError.message}</Alert>
          )}

          {!filteredFutureMatches && <p>Lade …</p>}

          {filteredFutureMatches &&
            filteredFutureMatches.length > 0 &&
            users && (
              <Grid container spacing={5}>
                {filteredFutureMatches.map(match => (
                  <Grid item xs={12} sm={6} md={5} lg={4} xl={3} key={match.id}>
                    <MatchCard match={match} userList={users} />
                  </Grid>
                ))}
              </Grid>
            )}

          {filteredFutureMatches && filteredFutureMatches.length === 0 && (
            <>
              <Typography paragraph>Wow. Much empty.</Typography>
              {numberOfEnabledFilters > 0 && (
                <Typography paragraph>Obacht! Filter ist aktiv.</Typography>
              )}
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
        </TabPanel>

        <TabPanel value="2">
          {pastMatchesError && (
            <Alert severity="error">Fehler: {pastMatchesError.message}</Alert>
          )}

          {!filteredPastMatches && <MatchCardSkeleton />}

          {filteredPastMatches && filteredPastMatches.length > 0 && users && (
            <Grid container spacing={5}>
              {filteredPastMatches.map(match => (
                <Grid item xs={12} sm={6} md={5} lg={4} xl={3} key={match.id}>
                  <MatchCard match={match} userList={users} />
                </Grid>
              ))}
            </Grid>
          )}

          {filteredPastMatches && filteredPastMatches.length === 0 && (
            <>
              <Typography paragraph>Wow. Much empty.</Typography>
              {numberOfEnabledFilters > 0 && (
                <Typography paragraph>Obacht! Filter ist aktiv.</Typography>
              )}
            </>
          )}
        </TabPanel>
      </TabContext>
    </>
  );
};

export default MatchesList;
