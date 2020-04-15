import React, { useContext, useRef, useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  UserContext,
  doCompanySignup,
  doPasswordReset,
} from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Button, Input, message } from 'antd';
import { formItemLayout } from './utils/styles';

export const ResetPasswordForm = withProtected(
  withRouter(({ history, match }) => {
    const { setLoading } = useContext(UserContext);
    const [buttonDisable, setButtonDisable] = useState(false);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        password: '',
      },
    });

    const { register, handleSubmit, errors, watch } = methods;
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async (data) => {
      setButtonDisable(true);
      try {
        const response = await doPasswordReset(
          data,
          match.params.token,
          match.params.id
        );
        message.success(response.status);
      } catch (error) {
        console.log(error);
        message.error(
          'Remember to create a secure password, at least 1 upper case and 1 lower case with numbers & special characters'
        );
      } finally {
        setButtonDisable(false);
      }
    };
    return (
      <LayoutTemplate>
        <FormContext {...methods}>
          <Form>
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
                    message: 'Password must have at least 10 characters',
                  },
                }}
              />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              required={true}
              validateStatus={
                errors.password_repeat?.message ? 'error' : 'success'
              }
              help={
                errors.password_repeat?.message &&
                errors.password_repeat.message
              }
            >
              <Controller
                as={Input.Password}
                type='password'
                placeholder='Repeat Password'
                name='password_repeat'
                rules={{
                  required: 'Required',
                  validate: (value) =>
                    value === password.current || 'The passwords do not match',
                }}
              />
            </Form.Item>

            <Form.Item {...formItemLayout}>
              <Button
                disabled={buttonDisable}
                type='primary'
                htmlType='submit'
                onClick={handleSubmit(onSubmit)}
              >
                Change Password
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
    inverted: true,
  }
);
