import React, { useContext } from 'react';
import { UserContext } from './auth.api';
//https://reacttraining.com/react-router/web/guides/quick-start
import { Redirect } from 'react-router-dom';
import { Loading } from './loading';

const ProtectedPagePlaceholder = () => <Loading />;

// This is a HOC -> High Order Component
export const withTypeUser = (
  Component,
  { redirect = true, redirectTo = '/profile', type = 'admin' } = {} // options are always present
) => props => {
  const { user, loading } = useContext(UserContext);
  // If you're talking about localClient Protection
  if (type === 'client') {
    if (!user.type) {
      // If we have an admin, then render the component
      return <Component />;
    } else {
      // If the user auth backend is loading (because there's no user yet) render the placeholder
      if (loading) return <ProtectedPagePlaceholder />;
      else {
        // If the auth has been completed and there is no admin then redirect or render placehoder
        // depending on choosen option
        if (redirect) {
          return <Redirect to={redirectTo} />;
        } else {
          return <ProtectedPagePlaceholder />;
        }
      }
    }
  } else {
    if (type === 'admin') {
      // If we have an admin, then render the component
      if (user.type === type) {
        return <Component />;
      } else {
        // If the user auth backend is loading (because there's no user yet) render the placeholder
        if (loading) return <ProtectedPagePlaceholder />;
        else {
          // If the auth has been completed and there is no admin then redirect or render placehoder
          // depending on choosen option
          if (redirect) {
            return <Redirect to={redirectTo} />;
          } else {
            return <ProtectedPagePlaceholder />;
          }
        }
      }
    } else {
      if (user.type) {
        return <Component />;
      } else {
        // If the user auth backend is loading (because there's no user yet) render the placeholder
        if (loading) return <ProtectedPagePlaceholder />;
        else {
          // If the auth has been completed and there is no admin then redirect or render placehoder
          // depending on choosen option
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
