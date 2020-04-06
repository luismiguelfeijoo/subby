import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { NewPlanPage } from '../pages/NewPlan.page';

export const NewPlanRouter = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}`} exact component={NewPlanPage} />
    </Switch>
  );
};
