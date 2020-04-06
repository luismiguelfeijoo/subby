import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { withProtected } from '../../lib/protectedRoute';

export const NewPlanRouter = withProtected(
  withTypeUser(
    ({ match }) => {
      return (
        <Switch>
          <Route path={`${match.url}/subscriptions`} exact component={} />
        </Switch>
      );
    },
    { redirectTo: '/', type: 'coordinator' }
  )
);
