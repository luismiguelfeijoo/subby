import React, { useContext, useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, askPasswordToken } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Button, Input } from 'antd';

export const ResetPasswordReq = withProtected(
  withRouter(({ history }) => {
    const { setLoading } = useContext(UserContext);

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16, offset: 4 }
      }
    };

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
          <Form>
            <Form.Item
              {...formItemLayout}
              validateStatus={errors.username?.message ? 'error' : 'success'}
              help={errors.username?.message && errors.username.message}
            >
              <Controller
                as={Input}
                name='username'
                placeholder="What's your email"
                rules={{
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address'
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
                Request New Password
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
