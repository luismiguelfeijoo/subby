import React, { useState, useContext, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UserContext,
  getSingleSubscription,
  getPlans,
  getExtras,
  updateSubscription,
} from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Form, Input, Button, Select, DatePicker, message, Spin } from 'antd';
import moment from 'moment';
import { formItemLayout, PageSpinner } from './utils/styles';
import { SpinIcon } from '../../lib/loading';
import { SiderMenu } from '../components/Layout/Menu';
const { Option } = Select;

export const SubscriptionEditPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { user, loading, setLoading } = useContext(UserContext);
      const [plans, setPlans] = useState([]);
      const [sub, setSub] = useState();
      const [selectedPlan, setSelectedPlan] = useState([]);
      const [buttonLoading, setButtonLoading] = useState(false);

      useEffect(() => {
        if (!loading) {
          fetchPlans();
          fetchSubscription(match.params.id);
        }
      }, []);

      const fetchPlans = () => {
        getPlans()
          .then((plans) => {
            setPlans(plans);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const fetchSubscription = (id) => {
        getSingleSubscription(id)
          .then((sub) => {
            setSub(sub);
            setSelectedPlan(sub.plans.map((plan) => plan.plan.name));
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const methods = useForm({
        mode: 'onBlur',
      });

      const { register, handleSubmit, errors, getValues } = methods;

      const onSubmit = async (data) => {
        setButtonLoading(true);
        try {
          const response = await updateSubscription(match.params.id, data);
          message.success(response.status);
        } catch (error) {
          message.error(error.response.data.status);
        } finally {
          setButtonLoading(false);
        }
      };

      return (
        <LayoutTemplate sider>
          {sub ? (
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
                        message: 'invalid email address',
                      },
                    }}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  {...formItemLayout}
                  required={true}
                  validateStatus={errors.name?.message ? 'error' : 'success'}
                  help={errors.name?.message && errors.name.message}
                >
                  <Controller
                    defaultValue={sub.name}
                    as={Input}
                    type='text'
                    placeholder='First Name'
                    name='name'
                    rules={{
                      required: 'Required',
                    }}
                  />
                </Form.Item>

                <Form.Item {...formItemLayout}>
                  <Controller
                    defaultValue={sub.plans.map((plan) => plan.plan.name)}
                    onChange={([event]) => {
                      setSelectedPlan(event);
                      return event;
                    }}
                    as={
                      <Select mode='multiple' placeholder='Select a plan'>
                        {plans &&
                          plans.map((plan, i) => {
                            return (
                              <Option value={plan.name} key={`${i} plan`}>{`${
                                plan.name
                              } - ${plan.price.price} ${
                                plan.price.currency || '$'
                              }`}</Option>
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
                      key={`${i} date ${plan}`}
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
                          width: '100%',
                        }}
                        placeholder={`Select ${plan} date`}
                        as={DatePicker}
                        rules={{
                          validate: (value) => value !== null,
                        }}
                        format='DD-MM-YYYY'
                        name={`planDates[${i}]`}
                      />
                    </Form.Item>
                  );
                })}
                <Form.Item {...formItemLayout}>
                  <Button
                    disabled={buttonLoading}
                    type='primary'
                    htmlType='submit'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Update Subscription!
                  </Button>
                </Form.Item>
              </Form>
            </FormContext>
          ) : (
            <PageSpinner>
              <Spin size='large' indicator={SpinIcon} />
            </PageSpinner>
          )}
        </LayoutTemplate>
      );
    }),
    {
      type: 'admin',
      redirectTo: '/login',
    }
  )
);

/*

                {selectedExtra?.length > 0 &&
                  selectedExtra.map((extra, i) => {
                    return (
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Form.Item
                          {...formItemLayout}
                          key={`${i + 2} extra`}
                          style={{
                            display: 'inline-block',
                            width: '50%',
                            margin: '0 -15% 0 8.25%'
                          }}
                        >
                          <Controller
                            defaultValue={sub.extras.map(subExtra => {
                              if (extra !== 'extra') {
                                return subExtra.extra.name;
                              } else {
                                return 'Select extra';
                              }
                            })}
                            onChange={([event]) => {
                              console.log(event);
                              return event;
                            }}
                            as={
                              <Select placeholder='Select an Extra'>
                                {extras &&
                                  extras.map((extra, i) => {
                                    return (
                                      <Option value={extra.name} key={i}>{`${
                                        extra.name
                                      } - ${extra.price.price} ${extra.price
                                        .currency || '$'}`}</Option>
                                    );
                                  })}
                              </Select>
                            }
                            name={`extrasName[${i}]`}
                          />
                        </Form.Item>
                        <Form.Item
                          key={`${i} date ${extra}`}
                          {...formItemLayout}
                          validateStatus={
                            errors.extraDates ? 'error' : 'success'
                          }
                          help={errors.extraDates && 'Select the dates!'}
                          style={{
                            display: 'inline-block',
                            width: '48%'
                          }}
                        >
                          <Controller
                            style={{
                              width: '100%'
                            }}
                            defaultValue={
                              extra === sub.extras[i]?.extra.name
                                ? moment(sub.extras[i].date)
                                : ''
                            }
                            placeholder={`Select ${extra} date`}
                            as={DatePicker}
                            rules={{
                              validate: value => value !== ''
                            }}
                            format='DD-MM-YYYY'
                            name={`extraDates[${i}]`}
                          />
                        </Form.Item>
                      </Form.Item>
                    );
                  })}*/
