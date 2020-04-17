import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { NewCompanyPage } from '../pages/NewCompany.page';
import { CompanyRegisterPage } from '../pages/CompanyRegister.page';

export const NewCompanyRouter = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}`} exact component={NewCompanyPage} />
      <Route
        path={`${match.url}/:token`}
        component={props => <CompanyRegisterPage {...props} />}
      />
    </Switch>
  );
};
