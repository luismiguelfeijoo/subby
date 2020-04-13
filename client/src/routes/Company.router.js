import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SubscriptionListPage } from '../pages/SubscriptionList.page';
import { ClientListPage } from '../pages/ClientList.page';
import { SingleSubscriptionPage } from '../pages/SingleSubscriptions.page';
import { SubscriptionEditPage } from '../pages/SubscriptionEdit.page';
import { SingleClientPage } from '../pages/SingleClient.page';
import { NewPlanPage } from '../pages/NewPlan.page';
import { NewUserPage } from '../pages/NewUser.page';

export const CompanyRouter = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/new-plan`} exact component={NewPlanPage} />
      <Route path={`${match.url}/new-user`} exact component={NewUserPage} />
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
