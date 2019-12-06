import React, { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import fromUnixTime from 'date-fns/fromUnixTime';
import TimeAgo from 'react-timeago';

import { FirebaseContext } from '../api';
import { formatDate } from '../utils';

type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

type Match = {
  date: Timestamp;
  players: string[];
};

const Home: React.FC = () => {
  const firebase = useContext(FirebaseContext);

  const [matches, loading, error] = useCollection(
    firebase.store.collection('matches'),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true,
      },
    },
  );

  return (
    <>
      <h1>Daddel</h1>

      {error && (
        <p>
          <strong>Error: {JSON.stringify(error)}</strong>
        </p>
      )}
      {loading && <p>Loading...</p>}

      {matches && (
        <div>
          {matches.docs.map(doc => {
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
    </>
  );
};

export default Home;
