import React, { useState, useContext, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UserContext,
  getSingleSubscription,
  getPlans,
  getExtras,
  updateSubscription
} from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
const { Option } = Select;

export const SubscriptionEditPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { user, loading, setLoading } = useContext(UserContext);
      const [plans, setPlans] = useState([]);
      const [extras, setExtras] = useState([]);
      const [sub, setSub] = useState();
      const [selectedPlan, setSelectedPlan] = useState([]);
      const [selectedExtra, setSelectedExtra] = useState([]);

      useEffect(() => {
        if (!loading) {
          fetchPlans();
          fetchExtras();
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

      const fetchExtras = () => {
        getExtras()
          .then(extras => {
            setExtras(extras);
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
            setSelectedExtra(sub.extras.map(extra => extra.extra.name));
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

        setLoading(true);
        try {
          const response = await updateSubscription(match.params.id, data);
          history.push(`${match.url}`);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
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
                    disabled
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
                <Form.Item {...formItemLayout}>
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
                    name='plansName'
                  />
                </Form.Item>
                {selectedPlan.map((plan, i) => {
                  return (
                    <Form.Item
                      key={i}
                      {...formItemLayout}
                      validateStatus={errors.planDates ? 'error' : 'success'}
                      help={errors.planDates && 'Select the dates!'}
                    >
                      <Controller
                        defaultValue={
                          plan === sub.plans[i]?.plan.name
                            ? moment(sub.plans[i].startDate)
                            : ''
                        }
                        style={{
                          width: '100%'
                        }}
                        placeholder={`Select ${plan} date`}
                        as={DatePicker}
                        rules={{
                          validate: value => value !== null
                        }}
                        format='DD-MM-YYYY'
                        name={`planDates[${i}]`}
                      />
                    </Form.Item>
                  );
                })}

                <Form.Item {...formItemLayout}>
                  <Controller
                    defaultValue={sub.extras.map(extra => extra.extra.name)}
                    onChange={([event]) => {
                      setSelectedExtra(event);
                      return event;
                    }}
                    as={
                      <Select mode='multiple' placeholder='Select an Extra'>
                        {extras &&
                          extras.map((extra, i) => {
                            return (
                              <Option value={extra.name} key={i}>{`${
                                extra.name
                              } - ${extra.price.price} ${extra.price.currency ||
                                '$'}`}</Option>
                            );
                          })}
                      </Select>
                    }
                    name='extrasName'
                  />
                </Form.Item>
                {selectedExtra.map((extra, i) => {
                  return (
                    <Form.Item
                      key={i}
                      {...formItemLayout}
                      validateStatus={errors.extraDates ? 'error' : 'success'}
                      help={errors.extraDates && 'Select the dates!'}
                    >
                      <Controller
                        defaultValue={
                          extra === sub.extras[i]?.extra.name
                            ? moment(sub.extras[i].date)
                            : ''
                        }
                        style={{
                          width: '100%'
                        }}
                        placeholder={`Select ${extra} date`}
                        as={DatePicker}
                        rules={{
                          validate: value => value !== null
                        }}
                        format='DD-MM-YYYY'
                        name={`extraDates[${i}]`}
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
