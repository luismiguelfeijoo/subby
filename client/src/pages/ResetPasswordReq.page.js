import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, askPasswordToken } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Button, Input, message, Typography } from 'antd';
import { formItemLayout } from './utils/styles';
const { Title } = Typography;

export const ResetPasswordReq = withProtected(
  withRouter(({ history }) => {
    const { setLoading } = useContext(UserContext);
    const [buttonLoading, setButtonLoading] = useState(false);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: '',
      },
    });

    const { register, handleSubmit, errors } = methods;

    const onSubmit = async (data) => {
      setButtonLoading(true);
      try {
        const response = await askPasswordToken(data);
        message.success(response.status);
      } catch (error) {
        message.error(error.response.data.status);
      } finally {
        setButtonLoading(false);
      }
    };

    return (
      <LayoutTemplate>
        <FormContext {...methods}>
          <Title level={1} style={{ color: '#fff', textAlign: 'center' }}>
            REQUEST NEW PASSWORD
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
                    message: 'invalid email address',
                  },
                }}
              />
            </Form.Item>
            <Form.Item {...formItemLayout}>
              <Button
                loading={buttonLoading}
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
    inverted: true,
  }
);
