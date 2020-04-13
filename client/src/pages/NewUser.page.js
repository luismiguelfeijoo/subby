import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UserContext,
  askUserToken,
  createSubscription,
  getPlans
} from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
const { Option } = Select;

export const NewUserPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { user, loading, setLoading } = useContext(UserContext);
      const [form] = Form.useForm();
      const [type, setType] = useState();
      const [plans, setPlans] = useState([]);
      const [selectedPlan, setSelectedPlan] = useState([]);
      useEffect(() => {
        if (!loading) {
          fetchPlans();
        }
      }, []);

      const fetchPlans = () => {
        getPlans()
          .then(plans => {
            setPlans(plans);
          })
          .catch(error => {
            console.log(error);
          });
      };

      const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16, offset: 4 }
        }
      };

      const methods = useForm({
        mode: 'onBlur'
      });

      const { register, handleSubmit, errors } = methods;

      const onSubmitUser = async data => {
        setLoading(true);
        try {
          const response = await askUserToken(data);
          message.success(response.status);
          history.push('/new-user');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      const onSubmitSub = async data => {
        setLoading(true);
        try {
          const response = await createSubscription(data);
          message.success(response.status);
          history.push('/company/new-user');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <LayoutTemplate sider={true}>
          <Form onFinish={value => console.log(value)} form={form}>
            <Form.Item {...formItemLayout}>
              <Select
                placeholder='Add a ...'
                onChange={value => setType(value)}
                allowClear
              >
                <Option value='user'>User</Option>
                <Option value='subscription'>Subscription</Option>
              </Select>
            </Form.Item>
          </Form>

          {type === 'user' ? (
            <FormContext {...methods}>
              <Form>
                <Form.Item
                  {...formItemLayout}
                  validateStatus={
                    errors.username?.message ? 'error' : 'success'
                  }
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
                        message: 'invalid email address'
                      }
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
                      required: 'Required'
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
          ) : type ? (
            <FormContext {...methods}>
              <Form>
                <Form.Item
                  {...formItemLayout}
                  validateStatus={
                    errors.username?.message ? 'error' : 'success'
                  }
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
                        message: 'invalid email address'
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  required={true}
                  validateStatus={
                    errors.firstName?.message ? 'error' : 'success'
                  }
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
                  required={true}
                  validateStatus={
                    errors.lastName?.message ? 'error' : 'success'
                  }
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
                <Form.Item
                  {...formItemLayout}
                  validateStatus={errors.planName?.type ? 'error' : 'success'}
                  help={
                    errors.planName?.type && 'Please, select at least 1 plan!'
                  }
                >
                  <Controller
                    onChange={([event]) => {
                      setSelectedPlan(event);
                      return event;
                    }}
                    as={
                      <Select mode='multiple' placeholder='Select a plan'>
                        {plans &&
                          plans.map((plan, i) => {
                            return (
                              <Option value={plan.name} key={i}>{`${
                                plan.name
                              } - ${plan.price.price} ${plan.price.currency ||
                                '$'}`}</Option>
                            );
                          })}
                      </Select>
                    }
                    rules={{
                      validate: value => value.length > 0
                    }}
                    name='planName'
                  />
                </Form.Item>
                {selectedPlan.map((plan, i) => {
                  return (
                    <Form.Item
                      key={i}
                      {...formItemLayout}
                      validateStatus={errors.dates ? 'error' : 'success'}
                      help={
                        errors.dates && 'Provide the dates for all the plans!'
                      }
                    >
                      <Controller
                        style={{
                          width: '100%'
                        }}
                        placeholder={`Select ${plan} date`}
                        as={DatePicker}
                        rules={{
                          validate: value => value !== null
                        }}
                        format='DD-MM-YYYY'
                        name={`dates[${i}]`}
                      />
                    </Form.Item>
                  );
                })}
                <Form.Item {...formItemLayout}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    onClick={handleSubmit(onSubmitSub)}
                  >
                    Add Subscription!
                  </Button>
                </Form.Item>
              </Form>
            </FormContext>
          ) : (
            ''
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
