import React, { useContext, useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, askPasswordToken } from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { Input } from '../components/Input';
import { Button, Form } from './utils/styles';
import { LayoutTemplate } from '../components/Layout';

export const ResetPasswordReq = withProtected(
  withRouter(({ history }) => {
    const { setLoading } = useContext(UserContext);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: ''
      }
    });

    const { register, handleSubmit, errors } = methods;

    const onSubmit = async data => {
      setLoading(true);
      try {
        const response = await askPasswordToken(data);
        history.push('/');
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
            <Button type='submit'>Request New Password</Button>
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
