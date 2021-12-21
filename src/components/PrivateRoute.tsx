import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

import ROUTES from '../constants/routes';
import { auth } from '../services/firebase';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...props }) => {
  const [authUser, authLoading] = useAuthState(auth);

  if (authLoading) {
    return null;
  }

  return (
    <Route
      {...props}
      render={routeProps =>
        authUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: ROUTES.ROOT,
              state: {
                from: routeProps.location,
              },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
