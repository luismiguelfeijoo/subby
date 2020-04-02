import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ResetPasswordForm } from '../pages/ResetPasswordForm.page';
import { ResetPasswordReq } from '../pages/ResetPasswordReq.page';

export const ResetPasswordRouter = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}`} exact component={ResetPasswordReq} />
      <Route
        path={`${match.url}/:id/:token`}
        component={props => <ResetPasswordForm {...props} />}
      />
    </Switch>
  );
};
