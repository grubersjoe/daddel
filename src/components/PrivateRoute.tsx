import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import firebase from '../api';
import * as ROUTES from '../constants/routes';

type Props = {
  component: ComponentType;
} & RouteProps;

const PrivateRoute: React.FC<Props> = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={props =>
      firebase.auth.currentUser !== null ? (
        <Component {...props} />
      ) : (
        <Redirect to={ROUTES.ROOT} />
      )
    }
  />
);

export default PrivateRoute;
