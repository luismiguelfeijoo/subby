import React, { useContext, useRef, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  UserContext,
  doCompanySignup,
  doPasswordReset
} from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { Input } from '../components/Input';
import { Button, Form } from './utils/styles';
import jwt from 'jsonwebtoken';
import { LayoutTemplate } from '../components/Layout';

export const ResetPasswordForm = withProtected(
  withRouter(({ history, match }) => {
    const { setLoading } = useContext(UserContext);

    /* Use this to only paint this view if the token is correct
    useEffect(() => {
      setLoading(true);
      try {
        let decode = jwt.verify(match.params.token, process.env.JWTSECRET);
      } catch (error) {
        history.push('/login');
      } finally {
        setLoading(false);
      }
    }, []);
    */

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        password: ''
      }
    });

    const { register, handleSubmit, errors, watch } = methods;
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async data => {
      //console.log(data);
      setLoading(true);
      try {
        const response = await doPasswordReset(
          data,
          match.params.token,
          match.params.id
        );
        history.push('/login');
      } catch (error) {
        // Add modal to show error
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    return (
      <LayoutTemplate>
        <FormContext {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name='password'
              type='password'
              placeholder='Password'
              ref={register({
                required: 'You must specify a password',
                minLength: {
                  value: 10,
                  message: 'Password must have at least 10 characters'
                }
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}

            <Input
              name='password_repeat'
              type='password'
              placeholder='Repeat Password'
              ref={register({
                validate: value =>
                  value === password.current || 'The passwords do not match'
              })}
            />

            {errors.password_repeat && <p>{errors.password_repeat.message}</p>}

            <Button type='submit'>Update Password</Button>
          </Form>
        </FormContext>
      </LayoutTemplate>
    );
  }),
  {
    redirect: true,
    redirectTo: 'profile',
    inverted: true
  }
);
