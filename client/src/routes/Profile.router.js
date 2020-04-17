import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ProfilePage } from '../pages/Profile.page';

export const ProfileRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}`}
        component={props => <ProfilePage {...props} />} // user profile
      />
    </Switch>
  );
};
