import React, { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import startOfToday from 'date-fns/startOfToday';

import AppBar from '@material-ui/core/AppBar';
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
import MatchCard from '../components/Match/MatchCard';
import SetNicknameDialog from '../components/Dialogs/SetNickname';
import Spinner from '../components/Spinner';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3} marginTop={7}>
          {children}
        </Box>
      )}
    </Typography>
  );
};

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

  const userList = users ? calcUserList(users) : null;

  if (futureMatchesError) console.error(futureMatchesError);
  if (pastMatchesError) console.error(pastMatchesError);
  if (usersError) console.error(usersError);

  const [tabIndex, setTabIndex] = useState(0);

  const noMatches = (
    <>
      <Typography paragraph>Wow. Much empty.</Typography>
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        to={ROUTES.ADD_MATCH}
      >
        Neuer Bolz
      </Button>
    </>
  );

  return (
    <>
      <SetNicknameDialog />
      <AppBar position="fixed" color="default">
        <Tabs
          value={tabIndex}
          onChange={(_event, index) => setTabIndex(index)}
          variant="fullWidth"
        >
          <Tab label="Anstehende" />
          <Tab label="Vergangene" />
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
        <TabPanel value={tabIndex} index={0}>
          {futureMatchesError && (
            <p>
              <strong>Error: {JSON.stringify(futureMatchesError)}</strong>
            </p>
          )}
          {futureMatchesLoading && <Spinner />}
          {futureMatches && userList && (
            <Grid container spacing={5} style={{ paddingBottom: '2rem' }}>
              {futureMatches.map(match => (
                <Grid item xs={12} md={4} lg={3}>
                  <MatchCard match={match} userList={userList} key={match.id} />
                </Grid>
              ))}
            </Grid>
          )}
          {futureMatches && futureMatches.length === 0 && noMatches}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {pastMatchesError && (
            <p>
              <strong>Error: {JSON.stringify(futureMatchesError)}</strong>
            </p>
          )}
          {pastMatchesLoading && <Spinner />}
          {pastMatches && userList && (
            <Grid container spacing={5} style={{ paddingBottom: '2rem' }}>
              {pastMatches.map(match => (
                <Grid item xs={12} md={4} lg={3}>
                  <MatchCard match={match} userList={userList} key={match.id} />
                </Grid>
              ))}
            </Grid>
          )}
          {pastMatches && pastMatches.length === 0 && (
            <Typography paragraph>Wow. Much empty.</Typography>
          )}
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export default MatchesList;
