import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import SwipeableViews from 'react-swipeable-views';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import firebase from '../api';
import MatchCard, { MatchCardSkeleton } from '../components/MatchCard';

export type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

export type Match = {
  date: Timestamp;
  players: string[];
  maxPlayers: number;
};

const currentTime = new Date();

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
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
    firebase.db
      .collection('matches')
      .where('date', '>=', currentTime)
      .orderBy('date', 'asc'),
  );

  const [pastMatches, pastLoading, pastError] = useCollection(
    firebase.db
      .collection('matches')
      .where('date', '<', currentTime)
      .orderBy('date', 'asc'),
  );

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, index: number) => {
    setTabIndex(index);
  };

  const handleChangeIndex = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="secondary"
          variant="fullWidth"
        >
          <Tab label="Anstehend" />
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
          {futureLoading && <MatchCardSkeleton />}
          {futureMatches && (
            <div>
              {futureMatches.docs.map(doc => (
                <MatchCard match={doc.data() as Match} key={doc.id} />
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {pastError && (
            <p>
              <strong>Error: {JSON.stringify(futureError)}</strong>
            </p>
          )}
          {pastLoading && <MatchCardSkeleton />}
          {pastMatches && (
            <div>
              {pastMatches.docs.map(doc => (
                <MatchCard match={doc.data() as Match} key={doc.id} />
              ))}
            </div>
          )}
        </TabPanel>
      </SwipeableViews>
    </>
  );
};

export default Matches;
