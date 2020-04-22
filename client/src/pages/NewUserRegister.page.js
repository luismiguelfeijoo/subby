import React, { useContext, useRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, doUserSignup } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { LayoutTemplate } from '../components/Layout';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Typography,
  notification,
} from 'antd';
const { Option } = Select;
const { Title } = Typography;
import jwt from 'jsonwebtoken';
import '../../public/css/form.css';

export const UserRegisterPage = withRouter(({ history, match }) => {
  const { setLoading, user, setUser, setNotifications, setSocket } = useContext(
    UserContext
  );
  const [userType, setUserType] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      let decode = jwt.verify(match.params.token, process.env.JWTSECRET);
      if (decode) {
        setUserType(decode.type);
      }
    } catch (error) {
      history.push('/');
      console.log(error);
    } finally {
      if (user) {
        history.push('/profile');
      }
      setLoading(false);
    }
  }, []);

  const prefixSelector = (
    <Form.Item noStyle>
      <Controller
        as={
          <Select>
            <Option value='58'>+58</Option>
            <Option value='34'>+34</Option>
          </Select>
        }
        placeholder='+00'
        style={{
          width: 70,
        }}
        name='prefix'
      />
    </Form.Item>
  );

  const methods = useForm({
    mode: 'onBlur',
    defaultValue: {
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const { register, handleSubmit, errors, watch } = methods;
  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    setButtonLoading(true);
    try {
      const user = await doUserSignup(data, match.params.token);
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
    <LayoutTemplate>
      <FormContext {...methods}>
        <Title level={1} style={{ color: '#fff', textAlign: 'center' }}>
          REGISTER
        </Title>
        <Form className='outForm'>
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
          {userType === 'client' && (
            <Form.Item
              validateStatus={errors.lastName?.message ? 'error' : 'success'}
              help={errors.lastName?.message && errors.lastName.message}
              wrapperCol={{ xs: { span: 24 } }}
            >
              <Controller
                name='phone'
                as={Input}
                placeholder='Phone Number'
                addonBefore={prefixSelector}
                style={{
                  width: '100%',
                }}
                rules={[
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                ]}
              />
            </Form.Item>
          )}

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
