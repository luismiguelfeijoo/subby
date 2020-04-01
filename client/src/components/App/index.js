import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withUser } from '../../../lib/withUser';
import { HomePage } from '../../pages/Home.page';
import { NewCompanyPage } from '../../pages/NewCompany.page';
import { CompanyRegisterPage } from '../../pages/CompanyRegister.page';

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
      </Switch>
    </Router>
  );
});
