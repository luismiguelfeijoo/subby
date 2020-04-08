import React, { useState, useContext, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UserContext,
  getSingleSubscription,
  getPlans
} from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, DatePicker } from 'antd';
const { MonthPicker } = DatePicker;
const { Option } = Select;

export const SubscriptionEditPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { user, loading, setLoading } = useContext(UserContext);
      const [plans, setPlans] = useState([]);
      const [sub, setSub] = useState();
      const [selectedPlan, setSelectedPlan] = useState([]);

      useEffect(() => {
        if (!loading) {
          fetchPlans();
          fetchSubscription(match.params.id);
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

      const fetchSubscription = id => {
        getSingleSubscription(id)
          .then(sub => {
            setSub(sub);
            setSelectedPlan(sub.plans.map(plan => plan.plan.name));
          })
          .catch(err => {
            console.log(err);
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

      const { register, handleSubmit, errors, getValues } = methods;

      const onSubmit = async data => {
        console.log(data);
        /*
        setLoading(true);
        try {
          const response = await createSubscription(data);
          history.push('/new-user');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }*/
      };

      return (
        <LayoutTemplate sider={true}>
          {sub && (
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
                    defaultValue={sub.parents[0].username}
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
                    defaultValue={sub.name.first}
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
                    defaultValue={sub.name.last}
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
                  validateStatus={errors.plan?.message ? 'error' : 'success'}
                  help={errors.plan?.message && errors.plan.message}
                >
                  <Controller
                    defaultValue={sub.plans.map(plan => plan.plan.name)}
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
                      required: 'Required'
                    }}
                    name='planName'
                  />
                </Form.Item>
                {selectedPlan.map((plan, i) => {
                  return (
                    <Form.Item
                      key={i}
                      {...formItemLayout}
                      validateStatus={
                        errors.date?.message ? 'error' : 'success'
                      }
                      help={errors.date?.message && errors.date.message}
                    >
                      <Controller
                        style={{
                          width: '100%'
                        }}
                        placeholder={`Select ${plan} date`}
                        as={DatePicker}
                        rules={{
                          required:
                            'Please, provide a starting date for the plan'
                        }}
                        format='DD-MM-YYYY'
                        name={`date${i}`}
                      />
                    </Form.Item>
                  );
                })}

                <Form.Item {...formItemLayout}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Add Subscription!
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
