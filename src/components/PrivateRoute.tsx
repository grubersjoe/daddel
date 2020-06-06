import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import ROUTES from '../constants/routes';
import { AuthUserContext } from './App';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...props }) => {
  const authUser = useContext(AuthUserContext);

  return (
    <Route
      {...props}
      render={props =>
        authUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: ROUTES.ROOT,
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
