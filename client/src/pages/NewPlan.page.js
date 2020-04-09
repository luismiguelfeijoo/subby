import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, createPlanOrExtra } from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select } from 'antd';
import { formItemLayout } from './utils/styles';
const { Option } = Select;

export const NewPlanPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { user, setLoading } = useContext(UserContext);
      const [form] = Form.useForm();
      const [type, setType] = useState();

      const methods = useForm({
        mode: 'onBlur'
      });

      const { register, handleSubmit, errors } = methods;

      const currencySelector = (
        <Form.Item noStyle>
          <Controller
            as={
              <Select>
                <Option value='€'>€</Option>
                <Option value='$'>$</Option>
              </Select>
            }
            defaultValue='€'
            style={{
              width: 70
            }}
            name='currency'
          />
        </Form.Item>
      );

      const onSubmit = async data => {
        setLoading(true);
        try {
          const response = await createPlanOrExtra(data, type);
          history.push('/new-plan');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <LayoutTemplate sider={true}>
          <Form form={form}>
            <Form.Item {...formItemLayout}>
              <Select
                placeholder='Create a ...'
                onChange={value => setType(value)}
                allowClear
              >
                <Option value='plan'>Plan</Option>
                <Option value='extra'>Extra</Option>
              </Select>
            </Form.Item>
          </Form>

          {type && (
            <FormContext {...methods}>
              <Form>
                <Form.Item
                  {...formItemLayout}
                  validateStatus={errors.name?.message ? 'error' : 'success'}
                  help={errors.name?.message && errors.name.message}
                >
                  <Controller
                    as={Input}
                    name='name'
                    placeholder={`Name of the ${type}`}
                    rules={{
                      required: 'Please, input the name'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  validateStatus={errors.price?.message ? 'error' : 'success'}
                  help={errors.price?.message && errors.price.message}
                  {...formItemLayout}
                >
                  <Controller
                    name='price'
                    type='number'
                    step={0.1}
                    as={Input}
                    placeholder='Price'
                    addonAfter={currencySelector}
                    style={{
                      width: '100%'
                    }}
                    rules={{
                      required: 'Please input the price!',
                      min: { value: 0.1, message: 'Input a valid price!' }
                    }}
                  />
                </Form.Item>

                <Form.Item {...formItemLayout}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Create User!
                  </Button>
                </Form.Item>
              </Form>
            </FormContext>
          )}
        </LayoutTemplate>
      );
    }),
    {
      type: 'admin',
      redirectTo: '/login'
    }
  )
);
