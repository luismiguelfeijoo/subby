import React, { useEffect, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';

export const HomePage = withProtected(
  withRouter(({ history }) => {
    const { user, setLoading } = useContext(UserContext);
    return (
      <LayoutTemplate>
        <div>Hola</div>
      </LayoutTemplate>
    );
  }),
  {
    redirect: true,
    redirectTo: 'profile',
    inverted: true
  }
);
