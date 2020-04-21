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
import { Form, Button, Input, message, Typography } from 'antd';
import { formItemLayout } from './utils/styles';
import { SiderMenu } from '../components/Layout/Menu';
const { Title } = Typography;

export const ResetPasswordForm = withRouter(({ history, match }) => {
  const { setLoading, setUser, user } = useContext(UserContext);
  const [buttonDisable, setButtonDisable] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user) {
      history.push('/profile');
    }
    setLoading(false);
  }, []);

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
      const user = await doPasswordReset(
        data,
        match.params.token,
        match.params.id
      );
      setUser(user);
      history.push('/profile');
    } catch (error) {
      console.log(error.response);
      message.error(error.response.data.status);
      setButtonDisable(false);
    }
  };

  return (
    <LayoutTemplate>
      <FormContext {...methods} menu={<SiderMenu broken />}>
        <Title level={1} style={{ color: '#fff', textAlign: 'center' }}>
          UPDATE YOUR PASSWORD
        </Title>
        <Form
          style={{
            width: '100%',
            backgroundColor: '#fff',
            margin: '40px 0',
            padding: '30px 8%',
            borderRadius: '5px',
          }}
        >
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
              errors.password_repeat?.message && errors.password_repeat.message
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
});
