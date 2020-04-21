import React, { useState, useContext, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, updateUser } from '../../lib/auth.api';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, message, Typography } from 'antd';
import { formItemLayout } from './utils/styles';
import { SiderMenu } from '../components/Layout/Menu';
const { Option } = Select;
const { Title } = Typography;
export const ProfilePage = withProtected(
  withRouter(({ history, match }) => {
    const { user, setUser, setLoading } = useContext(UserContext);
    const [buttonLoading, setButtonLoading] = useState(false);
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
          defaultValue={user.phone ? `+${user.phone.prefix}` : ''}
        />
      </Form.Item>
    );

    const methods = useForm({
      mode: 'onBlur',
    });

    const { register, handleSubmit, errors, reset } = methods;

    const onSubmit = async (data) => {
      setButtonLoading(true);
      try {
        const response = await updateUser(data);
        setButtonLoading(false);
        setUser(response.user);
        message.success(response.status);
      } catch (error) {
        message.error(error.response.data.status);
        setButtonLoading(false);
      } finally {
        reset();
      }
    };

    return (
      <LayoutTemplate
        sider={true}
        menu={<SiderMenu currentMenuTab='User' currentPage='profile' />}
      >
        <FormContext {...methods}>
          <Title style={{ textAlign: 'center' }} level={2}>
            Profile
          </Title>
          <Form style={{ width: '100%', marginTop: '40px' }}>
            <Form.Item
              {...formItemLayout}
              validateStatus={errors.username?.message ? 'error' : 'success'}
              help={errors.username?.message && errors.username.message}
            >
              <Controller
                defaultValue={user.username}
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
                disabled
              />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              validateStatus={errors.firstName?.message ? 'error' : 'success'}
              help={errors.firstName?.message && errors.firstName.message}
            >
              <Controller
                defaultValue={user.name.first}
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
              {...formItemLayout}
              required={true}
              validateStatus={errors.lastName?.message ? 'error' : 'success'}
              help={errors.lastName?.message && errors.lastName.message}
            >
              <Controller
                defaultValue={user.name.last}
                as={Input}
                type='text'
                placeholder='Last Name'
                name='lastName'
                rules={{
                  required: 'Required',
                }}
              />
            </Form.Item>
            {!user.type && (
              <Form.Item
                validateStatus={errors.lastName?.message ? 'error' : 'success'}
                help={errors.lastName?.message && errors.lastName.message}
                {...formItemLayout}
              >
                <Controller
                  name='phone'
                  defaultValue={user.phone.phone}
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
            <Form.Item {...formItemLayout}>
              <Button
                disabled={buttonLoading}
                type='primary'
                htmlType='submit'
                onClick={handleSubmit(onSubmit)}
              >
                Update User!
              </Button>
            </Form.Item>
          </Form>
        </FormContext>
      </LayoutTemplate>
    );
  })
);
