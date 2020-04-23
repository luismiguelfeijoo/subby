import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ClientDetailPage } from '../pages/ClientDetail.page';

export const ClientRouter = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.url}/details`} component={ClientDetailPage} />
    </Switch>
  );
};
