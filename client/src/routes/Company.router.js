import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withTypeUser } from '../../lib/protectedTypeUser';

export const NewPlanRouter = withTypeUser(
  ({ match }) => {
    return (
      <Switch>
        <Route path={`${match.url}/subscriptions`} exact component={} />
      </Switch>
    );
  },
  { redirectTo: '/', type: 'coordinator' }
);
