import React, { useState, useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import startOfToday from 'date-fns/startOfToday';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import firebase from '../api/firebase';
import * as ROUTES from '../constants/routes';
import { Match, User } from '../types';
import { calcUserList } from '../utils';
import { filterMatches } from '../utils/filter';
import { getStorageItem } from '../utils/local-storage';
import AppBar from '../components/AppBar';
import Filter, {
  MatchFilter,
  FILTER_LOCALSTORAGE_KEY,
} from '../components/Match/Filter';
import MatchCard from '../components/Match/MatchCard';
import SetNicknameDialog from '../components/Dialogs/SetNickname';
import Spinner from '../components/Spinner';

type TabPanelProps = {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
};

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
  const today = startOfToday();

  const [
    futureMatches,
    futureMatchesLoading,
    futureMatchesError,
  ] = useCollectionData<Match>(
    firebase.firestore
      .collection('matches')
      .where('date', '>=', today)
      .orderBy('date', 'asc'),
    {
      idField: 'id',
    },
  );

  const [pastMatches, pastMatchesLoading, pastMatchesError] = useCollectionData<
    Match
  >(
    firebase.firestore
      .collection('matches')
      .where('date', '<', today)
      .orderBy('date', 'desc')
      .limit(10),
    {
      idField: 'id',
    },
  );

  const [users, , usersError] = useCollectionData<User>(
    firebase.firestore.collection('users'),
    {
      idField: 'uid',
    },
  );

  if (usersError) console.error(usersError);
  const userList = users ? calcUserList(users) : null;

  const [filter, setFilter] = useState<MatchFilter>(
    getStorageItem<MatchFilter>(FILTER_LOCALSTORAGE_KEY) || { games: [] },
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

  return (
    <>
      <SetNicknameDialog />
      <AppBar>
        <>
          <Tabs
            value={tabIndex}
            onChange={(_event, index) => setTabIndex(index)}
            variant="fullWidth"
          >
            <Tab label="Anstehende" />
            <Tab label="Vergangene" />
          </Tabs>
        </>
      </AppBar>
      <Box px={3}>
        <Filter filter={filter} setFilter={setFilter} />
      </Box>
      <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
        <TabPanel value={tabIndex} index={0}>
          {futureMatchesError && (
            <p>
              <strong>Error: {JSON.stringify(futureMatchesError)}</strong>
            </p>
          )}
          {futureMatchesLoading && <Spinner />}
          {filteredFutureMatches &&
            filteredFutureMatches.length > 0 &&
            userList && (
              <Grid container spacing={5}>
                {filteredFutureMatches.map(match => (
                  <Grid item xs={12} md={4} lg={3} key={match.id}>
                    <MatchCard match={match} userList={userList} />
                  </Grid>
                ))}
              </Grid>
            )}
          {filteredFutureMatches && filteredFutureMatches.length === 0 && (
            <div>
              <Typography paragraph>Wow. Much empty.</Typography>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to={ROUTES.ADD_MATCH}
              >
                Neuer Bolz
              </Button>
            </div>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {pastMatchesError && (
            <p>
              <strong>Error: {JSON.stringify(futureMatchesError)}</strong>
            </p>
          )}
          {pastMatchesLoading && <Spinner />}
          {filteredPastMatches && filteredPastMatches.length > 0 && userList && (
            <>
              <Grid container spacing={5}>
                {filteredPastMatches.map(match => (
                  <Grid item xs={12} md={4} lg={3} key={match.id}>
                    <MatchCard match={match} userList={userList} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          {filteredPastMatches && filteredPastMatches.length === 0 && (
            <Typography paragraph>Wow. Much empty.</Typography>
          )}
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export default MatchesList;
