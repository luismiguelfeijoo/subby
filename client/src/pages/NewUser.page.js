import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, askUserToken } from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, message, Typography } from 'antd';
import { formItemLayout } from './utils/styles';
import { SiderMenu } from '../components/Layout/Menu';
const { Title } = Typography;
const { Option } = Select;

export const NewUserPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { setLoading } = useContext(UserContext);
      const [buttonLoading, setButtonLoading] = useState(false);
      const methods = useForm({
        mode: 'onBlur',
      });

      const { register, handleSubmit, errors, reset } = methods;

      const onSubmitUser = async (data) => {
        setButtonLoading(true);
        try {
          const response = await askUserToken(data);
          message.success(response.status);
          reset();
          setButtonLoading(false);
        } catch (error) {
          message.error(error.response.data.status);
          setTimeout(() => setButtonLoading(false), 1000);
        }
      };

      return (
        <LayoutTemplate
          sider
          currentPage='addUserOrPlan'
          currentMenuTab='company'
        >
          <FormContext {...methods}>
            <Title style={{ textAlign: 'center' }} level={2}>
              New User
            </Title>
            <Form style={{ width: '100%', marginTop: '40px' }}>
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
                  loading={buttonLoading}
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
