import React, { useContext, useRef, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, doUserSignup } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select } from 'antd';
const { Option } = Select;
import jwt from 'jsonwebtoken';

export const UserRegisterPage = withProtected(
  withRouter(({ history, match }) => {
    const { setLoading } = useContext(UserContext);
    const [userType, setUserType] = useState();

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
            width: 70
          }}
          name='prefix'
        />
      </Form.Item>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16, offset: 4 }
      }
    };

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
      }
    });

    const { register, handleSubmit, errors, watch } = methods;
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async data => {
      console.log(data);

      setLoading(true);
      try {
        const response = await doUserSignup(data, match.params.token);
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
                    message: 'Password must have at least 10 characters'
                  }
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
                  validate: value =>
                    value === password.current || 'The passwords do not match'
                }}
              />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              validateStatus={errors.firstName?.message ? 'error' : 'success'}
              help={errors.firstName?.message && errors.firstName.message}
            >
              <Controller
                as={Input}
                type='text'
                placeholder='First Name'
                name='firstName'
                rules={{
                  required: 'Required'
                }}
              />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              validateStatus={errors.lastName?.message ? 'error' : 'success'}
              help={errors.lastName?.message && errors.lastName.message}
            >
              <Controller
                as={Input}
                type='text'
                placeholder='Last Name'
                name='lastName'
                rules={{
                  required: 'Required'
                }}
              />
            </Form.Item>
            {userType === 'client' && (
              <Form.Item
                validateStatus={errors.lastName?.message ? 'error' : 'success'}
                help={errors.lastName?.message && errors.lastName.message}
                {...formItemLayout}
              >
                <Controller
                  name='phone'
                  as={Input}
                  placeholder='Phone Number'
                  addonBefore={prefixSelector}
                  style={{
                    width: '100%'
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your phone number!'
                    }
                  ]}
                />
              </Form.Item>
            )}

            <Form.Item {...formItemLayout}>
              <Button
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
  }),
  {
    redirect: true,
    redirectTo: 'profile',
    inverted: true
  }
);