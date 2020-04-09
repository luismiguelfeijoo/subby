import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SubscriptionListPage } from '../pages/SubscriptionList.page';
import { ClientListPage } from '../pages/ClientList.page';
import { SingleSubscriptionPage } from '../pages/SingleSubscriptions.page';
import { SubscriptionEditPage } from '../pages/SubscriptionEdit.page';
export const CompanyRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/subscriptions`}
        component={SubscriptionListPage}
      />
      <Route
        path={`${match.url}/subscriptions/edit/:id`}
        component={props => <SubscriptionEditPage {...props} />}
      />
      <Route
        path={`${match.url}/subscriptions/:id`}
        component={props => <SingleSubscriptionPage {...props} />}
      />
      <Route exact path={`${match.url}/clients`} component={ClientListPage} />
      <Route
        path={`${match.url}/clients/:id`}
        component={props => <SingleClientPage {...props} />}
      />
    </Switch>
  );
};
