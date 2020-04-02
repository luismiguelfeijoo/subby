import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withUser } from '../../../lib/withUser';
import { HomePage } from '../../pages/Home.page';
import { NewCompanyPage } from '../../pages/NewCompany.page';
import { CompanyRegisterPage } from '../../pages/CompanyRegister.page';
import { LoginPage } from '../../pages/Login.page';
import { ResetPasswordReq } from '../../pages/ResetPasswordReq.page';
import { ResetPasswordForm } from '../../pages/ResetPasswordForm.page';

export const App = withUser(() => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/new-company' exact component={NewCompanyPage} />
        <Route
          path='/new-company/:token'
          component={props => <CompanyRegisterPage {...props} />}
        />
        <Route path='/login' component={LoginPage} />
        <Route path='/reset-password' exact component={ResetPasswordReq} />
        <Route
          path='/reset-password/:id/:token'
          component={props => <ResetPasswordForm {...props} />}
        />
      </Switch>
    </Router>
  );
});
