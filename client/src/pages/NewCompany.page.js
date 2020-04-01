import React, { useContext, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext, askCompanyToken } from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { Input } from '../components/Input';
import { Button, Form } from './utils/styles';

export const NewCompanyPage = withProtected(
  withRouter(({ history }) => {
    const { setLoading } = useContext(UserContext);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: '',
        password: ''
      }
    });

    const { register, handleSubmit, errors } = methods;

    const onSubmit = async data => {
      //console.log(data);
      setLoading(true);
      try {
        const response = await askCompanyToken(data);
        history.push('/');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <FormContext {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='company'
            placeholder='Tell us the name of your company'
            ref={register({
              required: 'Required *'
            })}
          />
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

          <Button type='submit'>Send Info</Button>
        </Form>
      </FormContext>
    );
  }),
  {
    redirect: true,
    redirectTo: 'profile',
    inverted: true
  }
);
