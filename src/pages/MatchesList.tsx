import React, { useState, useMemo, useContext } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SwipeableViews from 'react-swipeable-views';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import LinkIcon from '@material-ui/icons/Link';

import { futureMatchesQuery, pastMatchesQuery } from '../queries/matches';
import ROUTES from '../constants/routes';
import useUserList from '../hooks/user-list';
import { Match } from '../types';
import { filterMatches, calcNumberOfEnabledFilters } from '../utils/filter';

import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '../utils/local-storage';
import AppBar from '../components/AppBar';
import Filter, { MatchFilter } from '../components/Match/Filter';
import MatchCard from '../components/Match/MatchCard';
import SetupUserDialog from '../components/Dialogs/SetupUserDialog';
import SingleView from '../components/Match/SingleView';
import { SnackbarContext } from '../components/Layout';
import MatchCardSkeleton from '../components/Match/MatchCardSkeleton';

type TabPanelProps = {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
};

const loadingAnimation =
  'pulse 0.75s cubic-bezier(.46,.03,.52,.96) 0s infinite';

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...props
}) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    {...props}
  >
    {value === index && (
      <Box p={3} pt={0}>
        {children}
      </Box>
    )}
  </Typography>
);

const MatchesList: React.FC = () => {
  const { match: matchParam } = useParams<{ match: string }>();
  const isSingleView = Boolean(matchParam && matchParam.length > 0);

  const history = useHistory();
  const theme = useTheme();
  const dispatchSnack = useContext(SnackbarContext);

  const [isRefetching, setIsRefetching] = useState(false);

  const [futureMatches, , futureMatchesError] = useCollectionData<Match>(
    futureMatchesQuery,
    {
      idField: 'id',
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    },
  );

  const [pastMatches, , pastMatchesError] = useCollectionData<Match>(
    pastMatchesQuery(10),
    { idField: 'id' },
  );

  futureMatchesQuery.onSnapshot(doc =>
    setIsRefetching(doc.metadata.fromCache || doc.metadata.hasPendingWrites),
  );

  const [userList] = useUserList();

  const [showFilter, setShowFilter] = useState(
    getStorageItem<boolean>(STORAGE_KEYS.matchFilterEnabled) ?? false,
  );

  const [filter, setFilter] = useState<MatchFilter>(
    getStorageItem<MatchFilter>(STORAGE_KEYS.matchFilter) ?? { games: [] },
  );

  const [tabIndex, setTabIndex] = useState(0);

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
      <SetupUserDialog />

      <AppBar filter={isSingleView ? undefined : filterConfig}>
        {isSingleView && (
          <>
            <Button
              variant="text"
              onClick={() => history.push(ROUTES.MATCHES_LIST)}
            >
              Alle Matches
            </Button>
            <Button
              variant="text"
              startIcon={<LinkIcon />}
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard
                    .writeText(window.location.href)
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
        )}
        {!isSingleView && (
          <Tabs
            value={tabIndex}
            onChange={(_event, index) => setTabIndex(index)}
            variant="fullWidth"
          >
            <Tab
              label="Anstehende"
              style={{
                ...(isRefetching && { animation: loadingAnimation }),
              }}
            />
            <Tab label="Vergangene" />
          </Tabs>
        )}
      </AppBar>

      {showFilter && (
        <Box px={3}>
          <Filter filter={filter} setFilter={setFilter} />
        </Box>
      )}

      {isSingleView ? (
        <SingleView userList={userList} />
      ) : (
        <>
          <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
            <TabPanel value={tabIndex} index={0}>
              {futureMatchesError && (
                <Alert severity="error">
                  Fehler: {futureMatchesError.message}
                </Alert>
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
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={ROUTES.ADD_MATCH}
                    style={{ marginTop: theme.spacing(1) }}
                  >
                    Neues Match
                  </Button>
                </div>
              )}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              {pastMatchesError && (
                <Alert severity="error">
                  Fehler: {pastMatchesError.message}
                </Alert>
              )}

              {!filteredPastMatches && <MatchCardSkeleton />}

              {filteredPastMatches &&
                filteredPastMatches.length > 0 &&
                userList && (
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
      )}
    </>
  );
};

export default MatchesList;
