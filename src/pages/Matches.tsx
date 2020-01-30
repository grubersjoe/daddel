import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import firebase from '../api/firebase';
import * as ROUTES from '../constants/routes';
import { Match } from '../types';
import { calcUserList } from '../utils';
import MatchCard from '../components/Match/MatchCard';
import SetNicknameDialog from '../components/Dialogs/SetNickname';
import Spinner from '../components/Spinner';

const currentTime = new Date();

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

const Matches: React.FC = () => {
  const [futureMatches, futureLoading, futureError] = useCollection(
    firebase.firestore
      .collection('matches')
      .where('date', '>=', currentTime)
      .orderBy('date', 'asc'),
  );

  const [pastMatches, pastLoading, pastError] = useCollection(
    firebase.firestore
      .collection('matches')
      .where('date', '<', currentTime)
      .orderBy('date', 'asc')
      .limit(100),
  );

  const [users] = useCollection(firebase.firestore.collection('users'));
  const userList = users ? calcUserList(users) : null;

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, index: number) => {
    setTabIndex(index);
  };

  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

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
        <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth">
          <Tab label="Anstehende" />
          <Tab label="Vergangene" />
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabIndex} onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabIndex} index={0}>
          {futureError && (
            <p>
              <strong>Error: {JSON.stringify(futureError)}</strong>
            </p>
          )}
          {futureLoading && <Spinner />}
          {futureMatches && userList && (
            <div>
              {futureMatches.docs.map(doc => (
                <MatchCard
                  match={{ ...doc.data(), id: doc.id } as Match}
                  userList={userList}
                  key={doc.id}
                />
              ))}
            </div>
          )}
          {futureMatches?.docs?.length === 0 && noMatches}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {pastError && (
            <p>
              <strong>Error: {JSON.stringify(futureError)}</strong>
            </p>
          )}
          {pastLoading && <Spinner />}
          {pastMatches && userList && (
            <div>
              {pastMatches.docs.map(doc => (
                <MatchCard
                  match={{ ...doc.data(), id: doc.id } as Match}
                  userList={userList}
                  key={doc.id}
                />
              ))}
            </div>
          )}
          {pastMatches?.docs?.length === 0 && (
            <Typography paragraph>Wow. Much empty.</Typography>
          )}
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export default Matches;
