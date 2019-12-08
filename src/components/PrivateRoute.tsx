import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import AuthUserContext from './AuthUserContext';

type Props = {
  component: ComponentType;
} & RouteProps;

const PrivateRoute: React.FC<Props> = ({ component: Component, ...props }) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Route
        {...props}
        render={props =>
          authUser ? <Component {...props} /> : <Redirect to={ROUTES.ROOT} />
        }
      />
    )}
  </AuthUserContext.Consumer>
);

export default PrivateRoute;
