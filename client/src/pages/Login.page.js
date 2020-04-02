import React, { useContext, useRef, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext, doLogin } from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { Input } from '../components/Input';
import { Button, Form } from './utils/styles';
import { LayoutTemplate } from '../components/Layout';

export const LoginPage = withProtected(
  withRouter(({ history, match }) => {
    const { setUser, setLoading } = useContext(UserContext);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: '',
        password: ''
      }
    });

    const { register, handleSubmit, errors, watch } = methods;
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async data => {
      setLoading(true);
      try {
        const newUser = await doLogin(data);
        setUser(newUser);
        history.push('/profile');
      } catch (error) {
        // do modal
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
              name='username'
              placeholder='Email'
              ref={register({
                required: 'Required *',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'invalid email address'
                }
              })}
              type='text'
            />

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

            <Button type='submit'>Send Info</Button>
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
