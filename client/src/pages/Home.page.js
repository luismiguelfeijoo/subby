import React, { useEffect, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';

export const HomePage = withProtected(
  withRouter(({ history }) => {
    const { user, setLoading } = useContext(UserContext);
    return <div>Hola</div>;
  }),
  {
    redirect: true,
    redirectTo: 'profile',
    inverted: true
  }
);