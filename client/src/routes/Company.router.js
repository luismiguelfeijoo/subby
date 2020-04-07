import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SubscriptionListPage } from '../pages/SubscriptionList.page';
import { ClientListPage } from '../pages/ClientList.page';
import { SingleSubscriptionPage } from '../pages/SingleSubscriptions.page';
export const CompanyRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/subscriptions`}
        component={SubscriptionListPage}
      />
      <Route
        path={`${match.url}/subscriptions/:id`}
        component={props => <SingleSubscriptionPage {...props} />}
      />
      <Route exact path={`${match.url}/clients`} component={ClientListPage} />
    </Switch>
  );
};
