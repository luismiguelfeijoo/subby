import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SubcriptionListPage } from '../pages/SubcriptionList.page';
import { ClientListPage } from '../pages/ClientList.page';

export const CompanyRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/subscriptions`}
        component={SubcriptionListPage}
      />
      <Route path={`${match.url}/clients`} component={ClientListPage} />
    </Switch>
  );
};
