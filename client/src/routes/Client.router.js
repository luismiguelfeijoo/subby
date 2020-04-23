import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ClientDetailPage } from '../pages/ClientDetail.page';
import { ClientSubscriptionsPage } from '../pages/ClienSubscription.page';

export const ClientRouter = ({ match }) => {
  return (
    <Switch>
      <Route exact path={`${match.url}/details`} component={ClientDetailPage} />
      <Route
        path={`${match.url}/subscriptions/:id`}
        component={(props) => <ClientSubscriptionsPage {...props} />}
      />
    </Switch>
  );
};
