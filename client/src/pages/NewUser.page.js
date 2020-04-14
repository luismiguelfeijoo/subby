import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UserContext,
  askUserToken,
  createSubscription,
  getPlans,
} from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { formItemLayout } from './utils/styles';
const { Option } = Select;

export const NewUserPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { setLoading } = useContext(UserContext);

      const methods = useForm({
        mode: 'onBlur',
      });

      const { register, handleSubmit, errors, reset } = methods;

      const onSubmitUser = async (data) => {
        setLoading(true);
        try {
          const response = await askUserToken(data);
          message.success(response.status);
          reset();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <LayoutTemplate
          sider={true}
          currentPage='addUserOrPlan'
          currentMenuTab='company'
        >
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
                      message: 'invalid email address',
                    },
                  }}
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                validateStatus={errors.type?.message ? 'error' : 'success'}
                help={errors.type?.message && errors.type.message}
              >
                <Controller
                  as={
                    <Select placeholder='Select the type of user!' allowClear>
                      <Option value='client'>Client</Option>
                      <Option value='coordinator'>Coordinator</Option>
                      <Option value='admin'>Admin</Option>
                    </Select>
                  }
                  rules={{
                    required: 'Required',
                  }}
                  name='type'
                />
              </Form.Item>

              <Form.Item {...formItemLayout}>
                <Button
                  type='primary'
                  htmlType='submit'
                  onClick={handleSubmit(onSubmitUser)}
                >
                  Create User!
                </Button>
              </Form.Item>
            </Form>
          </FormContext>
        </LayoutTemplate>
      );
    }),
    {
      type: 'admin',
      redirectTo: '/login',
    }
  )
);
