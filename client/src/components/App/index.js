import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withUser } from '../../../lib/withUser';
import { HomePage } from '../../pages/Home.page';
import { LoginPage } from '../../pages/Login.page';
import { NewCompanyRouter } from '../../routes/NewCompany.router';
import { ResetPasswordRouter } from '../../routes/ResetPassword.router';
import { NewUserRouter } from '../../routes/NewUser.router';
import { CompanyRouter } from '../../routes/Company.router';

export const App = withUser(() => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route
          path='/new-company'
          component={props => <NewCompanyRouter {...props} />}
        />
        <Route path='/login' component={LoginPage} />
        <Route
          path='/reset-password'
          component={props => <ResetPasswordRouter {...props} />}
        />
        <Route
          path='/new-user'
          component={props => <NewUserRouter {...props} />}
        />
        <Route
          path='/company'
          component={props => <CompanyRouter {...props} />}
        />
      </Switch>
    </Router>
  );
});
