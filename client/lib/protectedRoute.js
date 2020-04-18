import React, { useContext } from 'react';
import { UserContext } from './auth.api';
//https://reacttraining.com/react-router/web/guides/quick-start
import { Redirect } from 'react-router-dom';
import { Loading } from './loading';

const ProtectedPagePlaceholder = () => <Loading />;

// This is a HOC -> High Order Component
export const withProtected = (
  Component,
  { redirect = true, redirectTo = '/login', inverted = false } = {} // options are always present
) => (props) => {
  const { user, loading } = useContext(UserContext);
  if (!inverted) {
    if (user) {
      // If we have a user, then render the component
      return <Component />;
    } else {
      // If the user auth backend is loading (because there's no user yet) render the placeholder
      if (loading) return <ProtectedPagePlaceholder />;
      else {
        console.log('WP after loading');
        if (user) {
          return <Component />;
        } else {
          if (redirect) {
            return <Redirect to={redirectTo} />;
          } else {
            return <ProtectedPagePlaceholder />;
          }
        }
      }
    }
  } else {
    if (!user) {
      // If we have a user, then render the component
      return <Component />;
    } else {
      // If the user auth backend is loading (because there's no user yet) render the placeholder
      if (loading) return <ProtectedPagePlaceholder />;
      else {
        if (!user) {
          return <Component />;
        } else {
          if (redirect) {
            return <Redirect to={redirectTo} />;
          } else {
            return <ProtectedPagePlaceholder />;
          }
        }
      }
    }
  }
};
