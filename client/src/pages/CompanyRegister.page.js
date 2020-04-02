import React, { useContext, useRef, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext, doCompanyRegister } from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { Input } from '../components/Input';
import { Button, Form } from './utils/styles';
import jwt from 'jsonwebtoken';
import { LayoutTemplate } from '../components/Layout';

export const CompanyRegisterPage = withProtected(
  withRouter(({ history, match }) => {
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
      setLoading(true);
      try {
        let decode = jwt.verify(match.params.token, process.env.JWTSECRET);
      } catch (error) {
        history.push('/');
      } finally {
        setLoading(false);
      }
    }, []);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: '',
        password: '',
        firstName: '',
        lastName: ''
      }
    });

    const { register, handleSubmit, errors, watch } = methods;
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async data => {
      //console.log(data);
      setLoading(true);
      try {
        const response = await doCompanyRegister(data, match.params.token);
        history.push('/login');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    console.log(errors);
    return (
      <LayoutTemplate>
        <FormContext {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name='email'
              placeholder='Tell us your email'
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
            <Input
              name='firstName'
              placeholder='First Name'
              ref={register({
                required: 'Required *'
              })}
            />
            <Input
              name='lastName'
              placeholder='Last Name'
              ref={register({
                required: 'Required *'
              })}
            />
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
