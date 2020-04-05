import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { NewUserPage } from '../pages/NewUser.page';
import { UserRegisterPage } from '../pages/NewUserRegister.page';

export const NewUserRouter = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}`} exact component={NewUserPage} />
      <Route
        path={`${match.url}/:token`}
        component={props => <UserRegisterPage {...props} />} // new user registration
      />
    </Switch>
  );
};
