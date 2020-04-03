import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NewUserPage } from '../pages/NewUser.page';

export const NewUserRouter = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}`} exact component={NewUserPage} />
    </Switch>
  );
};
