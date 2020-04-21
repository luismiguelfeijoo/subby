import React, { useContext, useRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, doCompanySignup } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, message, Typography, notification } from 'antd';
import jwt from 'jsonwebtoken';
import { SiderMenu } from '../components/Layout/Menu';
const { Title } = Typography;

export const CompanyRegisterPage = withRouter(({ history, match }) => {
  const { setLoading, setUser, user, setNotifications, setSocket } = useContext(
    UserContext
  );
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      let decode = jwt.verify(match.params.token, process.env.JWTSECRET);
    } catch (error) {
      history.push('/');
    } finally {
      if (user) {
        history.push('/profile');
      }
      setLoading(false);
    }
  }, []);

  const methods = useForm({
    mode: 'onBlur',
    defaultValue: {
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const { register, handleSubmit, errors, watch } = methods;
  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    setButtonLoading(true);
    try {
      const user = await doCompanySignup(data, match.params.token);
      setButtonLoading(false);
      setUser(user);
      const userSocket = SocketConnection(setNotifications, user, notification);
      setSocket(userSocket);
      history.push('/profile');
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.status);
        setButtonLoading(false);
      }
    }
  };

  return (
    <LayoutTemplate menu={<SiderMenu broken />}>
      <FormContext {...methods}>
        <Title level={1} style={{ color: '#fff', textAlign: 'center' }}>
          REGISTER
        </Title>
        <Form
          style={{
            margin: '40px auto',
            width: '50%',
            backgroundColor: '#fff',
            padding: '30px 8%',
            borderRadius: '5px',
          }}
        >
          <Form.Item
            wrapperCol={{ xs: { span: 24 } }}
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
            wrapperCol={{ xs: { span: 24 } }}
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
          <Form.Item
            wrapperCol={{ xs: { span: 24 } }}
            required={true}
            validateStatus={errors.firstName?.message ? 'error' : 'success'}
            help={errors.firstName?.message && errors.firstName.message}
          >
            <Controller
              as={Input}
              type='text'
              placeholder='First Name'
              name='firstName'
              rules={{
                required: 'Required',
              }}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ xs: { span: 24 } }}
            required={true}
            validateStatus={errors.lastName?.message ? 'error' : 'success'}
            help={errors.lastName?.message && errors.lastName.message}
          >
            <Controller
              as={Input}
              type='text'
              placeholder='Last Name'
              name='lastName'
              rules={{
                required: 'Required',
              }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ xs: { span: 24 } }}>
            <Button
              disabled={buttonLoading}
              type='primary'
              htmlType='submit'
              onClick={handleSubmit(onSubmit)}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </FormContext>
    </LayoutTemplate>
  );
});
