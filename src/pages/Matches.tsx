import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import fromUnixTime from 'date-fns/fromUnixTime';

import firebase from '../api';
import { formatDate } from '../utils';
import Layout from '../components/Layout';
import TimeAgo from '../components/TimeAgo';

type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

type Match = {
  date: Timestamp;
  players: string[];
};

const currentTime = new Date();

const Home: React.FC = () => {
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

  return (
    <Layout>
      <p>{firebase.auth.currentUser ? 'Eingeloggt' : 'Nicht eingeloggt'}</p>

      <h2>Anstehende Matches</h2>
      {futureError && (
        <p>
          <strong>Error: {JSON.stringify(futureError)}</strong>
        </p>
      )}
      {futureLoading && <p>Lade...</p>}
      {futureMatches && (
        <div>
          {futureMatches.docs.map(doc => {
            const match = doc.data() as Match;
            return (
              <article key={doc.id}>
                <header>
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: formatDate(match.date.seconds),
                    }}
                  />
                  <p>
                    <TimeAgo date={fromUnixTime(match.date.seconds)} />
                  </p>
                </header>
                <ul>
                  {match.players.map(player => (
                    <li key={player}>{player}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}

      <h2>Vergangene Matches</h2>
      {pastError && (
        <p>
          <strong>Error: {JSON.stringify(futureError)}</strong>
        </p>
      )}
      {pastLoading && <p>Lade...</p>}
      {pastMatches && (
        <div>
          {pastMatches.docs.map(doc => {
            const match = doc.data() as Match;
            return (
              <article key={doc.id}>
                <header>
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: formatDate(match.date.seconds),
                    }}
                  />
                  <p>
                    <TimeAgo date={fromUnixTime(match.date.seconds)} />
                  </p>
                </header>
                <ul>
                  {match.players.map(player => (
                    <li key={player}>{player}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Home;
