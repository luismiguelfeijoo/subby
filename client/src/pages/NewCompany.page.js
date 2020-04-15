import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, askCompanyToken } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Button, Input, message } from 'antd';
import { formItemLayout } from './utils/styles';

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
        console.log(error.status);
        message.error("We can't process your request at this moment");
      } finally {
        setButtonLoading(false);
      }
    };

    return (
      <LayoutTemplate>
        <FormContext {...methods}>
          <Form>
            <Form.Item
              {...formItemLayout}
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
              {...formItemLayout}
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

            <Form.Item {...formItemLayout}>
              <Button
                iconLoading={buttonLoading}
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
