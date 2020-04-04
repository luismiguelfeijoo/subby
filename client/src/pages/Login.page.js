import React, { useContext, useRef, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext, doLogin } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Input, Form, Button } from 'antd';

export const LoginPage = withProtected(
  withRouter(({ history }) => {
    const { setUser, setLoading } = useContext(UserContext);

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16, offset: 4 }
      }
    };
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
          <Form>
            <Form.Item
              {...formItemLayout}
              validateStatus={errors.username?.message ? 'error' : 'success'}
              help={errors.username?.message && errors.username.message}
            >
              <Controller
                as={Input}
                name='username'
                placeholder='Username'
                rules={{
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address'
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              required={true}
              validateStatus={errors.password?.message ? 'error' : 'success'}
              help={errors.password?.message && errors.password.message}
            >
              <Controller
                as={Input.Password}
                type='password'
                placeholder='Password'
                name='password'
                rules={{
                  required: 'Required',
                  minLength: {
                    value: 10,
                    message: 'Password must have at least 10 characters'
                  }
                }}
              />
            </Form.Item>

            <Form.Item {...formItemLayout}>
              <Button
                type='primary'
                htmlType='submit'
                onClick={handleSubmit(onSubmit)}
              >
                Login
              </Button>
            </Form.Item>
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

/*
import { Input } from '../components/Input';
import { Button, Form } from './utils/styles';
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
          </Form>*/
