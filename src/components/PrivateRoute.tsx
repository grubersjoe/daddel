import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import ROUTES from '../constants/routes';
import { AuthUserContext } from './App';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...props }) => {
  const [authUser] = useContext(AuthUserContext);

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
