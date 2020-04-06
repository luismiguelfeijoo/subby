import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { withProtected } from '../../lib/protectedRoute';
import { SubcriptionListPage } from '../pages/SubcriptionList.page';

export const CompanyRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}/subscriptions`}
        component={SubcriptionListPage}
      />
    </Switch>
  );
};
