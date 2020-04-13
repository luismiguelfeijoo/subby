import React from 'react';
import { Switch, Route } from 'react-router-dom';

export const ProfileRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}`}
        component={props => <Component {...props} />} // user profile
      />
    </Switch>
  );
};
