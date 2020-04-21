import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, askCompanyToken } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Button, Input, message, Typography } from 'antd';
const { Title } = Typography;
import { formItemLayout } from './utils/styles';
import { SiderMenu } from '../components/Layout/Menu';

export const NewCompanyPage = withProtected(
  withRouter(({ history }) => {
    const [buttonLoading, setButtonLoading] = useState(false);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: '',
        password: '',
      },
    });

    const { register, handleSubmit, errors } = methods;

    const onSubmit = async (data) => {
      setButtonLoading(true);
      try {
        const response = await askCompanyToken(data);
        message.success(response.status);
      } catch (error) {
        if (error.response) {
          message.error(error.response.data.status);
        }
      } finally {
        setButtonLoading(false);
      }
    };

    return (
      <LayoutTemplate>
        <FormContext {...methods} menu={<SiderMenu broken />}>
          <Title level={1} style={{ color: '#fff', textAlign: 'center' }}>
            JOIN OUR COMUNITY
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
              validateStatus={errors.company?.message ? 'error' : 'success'}
              help={errors.company?.message && errors.company.message}
            >
              <Controller
                as={Input}
                name='company'
                placeholder="What's the name of your company?"
                rules={{
                  required: 'We need the name of your company to let you in!',
                }}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{ xs: { span: 24 } }}
              validateStatus={errors.email?.message ? 'error' : 'success'}
              help={errors.email?.message && errors.email.message}
            >
              <Controller
                as={Input}
                name='email'
                placeholder='Tell us your email'
                rules={{
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address',
                  },
                }}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ xs: { span: 24 } }}>
              <Button
                loading={buttonLoading}
                type='primary'
                htmlType='submit'
                onClick={handleSubmit(onSubmit)}
              >
                Send Info
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
