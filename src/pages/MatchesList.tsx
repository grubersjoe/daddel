import React, { useMemo, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import { Alert, Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material';

import { futureMatchesQuery, pastMatchesQuery } from '../queries/matches';
import ROUTES from '../constants/routes';
import useCurrentDate from '../hooks/useCurrentDate';
import useUserList from '../hooks/useUserList';
import { Match } from '../types';
import { calcNumberOfEnabledFilters, filterMatches } from '../utils/filter';

import { MAX_SHOWN_PAST_MATCHES } from '../constants';
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '../utils/local-storage';
import AppBar from '../components/AppBar';
import Filter, { MatchFilter } from '../components/Match/Filter';
import MatchCard from '../components/Match/MatchCard';
import MatchCardSkeleton from '../components/Match/MatchCardSkeleton';
import PageMetadata from '../components/PageMetadata';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';

const loadingAnimation =
  'pulse 0.75s cubic-bezier(.46,.03,.52,.96) 0s infinite';

const TabPanel: React.FC<{
  index: number;
  value: number;
}> = ({ children, value, index, ...props }) => (
  <Box role="tabpanel" hidden={value !== index} p={3} pt={0} {...props}>
    {children}
  </Box>
);

const MatchesList: React.FC = () => {
  const [userList] = useUserList();

  const [isRefetching, setIsRefetching] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

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

  futureMatchesQuery(currentDate).onSnapshot(doc =>
    setIsRefetching(doc.metadata.fromCache || doc.metadata.hasPendingWrites),
  );

  const [showFilter, setShowFilter] = useState(
    getStorageItem<boolean>(STORAGE_KEYS.matchFilterEnabled) ?? false,
  );

  const [filter, setFilter] = useState<MatchFilter>(
    getStorageItem<MatchFilter>(STORAGE_KEYS.matchFilter) ?? { games: [] },
  );

  const filteredFutureMatches = useMemo(
    () => (futureMatches ? filterMatches(futureMatches, filter) : null),
    [futureMatches, filter],
  );

  const filteredPastMatches = useMemo(
    () => (pastMatches ? filterMatches(pastMatches, filter) : null),
    [pastMatches, filter],
  );

  const numberOfEnabledFilters = calcNumberOfEnabledFilters(filter);
  const filterConfig = {
    color: showFilter ? 'primary' : 'inherit',
    enabled: numberOfEnabledFilters,
    title: showFilter ? 'Filter verstecken' : 'Filter anzeigen',
    onClick: () => {
      setShowFilter(enabled => {
        setStorageItem(STORAGE_KEYS.matchFilterEnabled, !enabled);
        return !enabled;
      });
    },
  } as const;

  return (
    <>
      <PageMetadata title="Matches – Daddel" />
      <SetupUserDialog />

      <AppBar filter={filterConfig}>
        <Tabs
          value={tabIndex}
          onChange={(_event, index) => setTabIndex(index)}
          variant="fullWidth"
        >
          <Tab
            label="Anstehende"
            sx={{
              ...(isRefetching && { animation: loadingAnimation }),
            }}
          />
          <Tab label="Vergangene" />
        </Tabs>
      </AppBar>

      {showFilter && (
        <Box px={3}>
          <Filter filter={filter} setFilter={setFilter} />
        </Box>
      )}

      <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
        <TabPanel value={tabIndex} index={0}>
          {futureMatchesError && (
            <Alert severity="error">Fehler: {futureMatchesError.message}</Alert>
          )}

          {!filteredFutureMatches && <p>Lade …</p>}

          {filteredFutureMatches &&
            filteredFutureMatches.length > 0 &&
            userList && (
              <Grid container spacing={5}>
                {filteredFutureMatches.map(match => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={match.id}>
                    <MatchCard match={match} userList={userList} />
                  </Grid>
                ))}
              </Grid>
            )}

          {filteredFutureMatches && filteredFutureMatches.length === 0 && (
            <div>
              <Typography paragraph>Wow. Much empty. </Typography>
              {numberOfEnabledFilters > 0 && (
                <Typography paragraph>Obacht! Filter ist aktiv.</Typography>
              )}

              <Button
                color="primary"
                component={Link}
                to={ROUTES.ADD_MATCH}
                sx={{ mt: 1 }}
              >
                Neues Match
              </Button>
            </div>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {pastMatchesError && (
            <Alert severity="error">Fehler: {pastMatchesError.message}</Alert>
          )}

          {!filteredPastMatches && <MatchCardSkeleton />}

          {filteredPastMatches && filteredPastMatches.length > 0 && userList && (
            <Grid container spacing={5}>
              {filteredPastMatches.map(match => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={match.id}>
                  <MatchCard match={match} userList={userList} />
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
      </SwipeableViews>
    </>
  );
};

export default MatchesList;
