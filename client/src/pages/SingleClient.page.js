import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  UserContext,
  getSingleClient,
  addPaymentOnClient,
  deleteSubscription,
  createSubscription,
  getPlans,
} from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import _ from 'lodash';
import {
  DatePicker,
  message,
  Button,
  Row,
  Col,
  List,
  Select,
  Descriptions,
  Modal,
  Form,
  Input,
  Typography,
  Popover,
} from 'antd';
const { Option } = Select;
const { Text } = Typography;
import moment from 'moment';
import { SingleSubscriptionPage } from './SingleSubscriptions.page';
import { formItemLayout } from './utils/styles';
export const SingleClientPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [client, setClient] = useState();
      const [visiblePaymentForm, setVisiblePaymentForm] = useState(false);
      const [visibleSubForm, setVisibleSubForm] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [month, setMonth] = useState();
      const [debtTotal, setDebtTotal] = useState(0);
      const [payedTotal, setPayedTotal] = useState(0);

      useEffect(() => {
        if (!loading) {
          fetchClient(match.params.id);
        }
      }, []);

      const fetchClient = (id) => {
        console.log('fetching');
        getSingleClient(id)
          .then((client) => {
            setClient(client);
            calculateTotal(client.debts, null, setDebtTotal);
            calculateTotal(client.payments, null, setPayedTotal);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      const calculateTotal = (data, month, setter) => {
        setter(
          data
            .filter((element) =>
              month
                ? moment(element.date).format('MM-YYYY') ===
                  month.format('MM-YYYY')
                : true
            )
            .reduce((acc, element) => acc + parseInt(element.amount.price), 0)
        );
      };

      const showModal = (setter) => {
        setter(true);
      };

      const handleCancel = (setter) => {
        setter(false);
      };

      const methods = useForm({
        mode: 'onBlur',
      });

      const { register, handleSubmit, errors, reset } = methods;

      const onSubmit = async (data) => {
        console.log(data);
        setConfirmLoading(true);
        try {
          const response = await addPaymentOnClient(match.params.id, data);
          fetchClient(match.params.id);
          message.success(response.status);
        } catch (error) {
          message.error(error.response.data.status);
        } finally {
          setConfirmLoading(false);
          setVisiblePaymentForm(false);
          reset();
        }
      };

      const onSubmitSub = async (data) => {
        setConfirmLoading(true);
        try {
          const response = await createSubscription(client.username, data);
          fetchClient(match.params.id);
          message.success(response.status);
        } catch (error) {
          message.error(error.response.data.status);
        } finally {
          setConfirmLoading(false);
          setVisibleSubForm(false);
          reset();
        }
      };

      return (
        <LayoutTemplate sider={true}>
          {client ? (
            <>
              <Descriptions
                title={`Client: ${client.name.first} ${client.name.last}`}
                bordered
                column={1}
                layout='vertical'
              >
                <Descriptions.Item label='Subscriptions'>
                  <List
                    size='small'
                    bordered
                    dataSource={client.subscriptions}
                    renderItem={(sub) => (
                      <List.Item
                        actions={[
                          <Link
                            key='list-loadmore-edit'
                            to={`/company/subscriptions/edit/${sub._id}`}
                          >
                            edit
                          </Link>,
                          <Popover
                            key='list-loadmore-delete'
                            title='Are you sure?'
                            trigger='click'
                            placement='topRight'
                            content={
                              <>
                                <p>This is a change you can't undo</p>
                                <Text
                                  type='danger'
                                  onClick={async () => {
                                    if (sub.active) {
                                      try {
                                        const response = await deleteSubscription(
                                          sub._id
                                        );
                                        message.success(response.status);
                                        fetchClient(match.params.id);
                                      } catch (error) {
                                        console.log(error);
                                      }
                                    } else {
                                      message.error(
                                        'This subscriptions is already inactive'
                                      );
                                    }
                                  }}
                                >
                                  Delete anyways
                                </Text>
                              </>
                            }
                          >
                            <Link to='#'>delete</Link>
                          </Popover>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Link to={`/company/subscriptions/${sub._id}`}>
                              {`${sub.name} ${
                                sub.active ? ' | Active' : ' | Inactive'
                              }`}
                            </Link>
                          }
                          description={
                            sub.level && <div>Level: {sub.level}</div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
                <Descriptions.Item label='Services & Payments'>
                  <DatePicker
                    picker='month'
                    format='MM-YYYY'
                    style={{ width: '100%', marginBottom: '20px' }}
                    allowClear
                    onChange={(e) => {
                      setDebtTotal(0);
                      setPayedTotal(0);
                      setMonth(() => (e ? e : e));
                      calculateTotal(client.debts, e, setDebtTotal);
                      calculateTotal(client.payments, e, setPayedTotal);
                    }}
                  />
                  <Row gutter={[16, { md: 16, lg: 24 }]}>
                    <Col md={24} lg={12}>
                      <List
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                        header={<div>Services Adquired</div>}
                        footer={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>Total:</div>
                            <div>{`${debtTotal} $`}</div>
                          </div>
                        }
                        size='small'
                        bordered
                        dataSource={client.debts
                          .sort((a, b) => (a.date < b.date ? -1 : 1))
                          .filter((debt) =>
                            month
                              ? moment(debt.date).format('MM-YYYY') ===
                                month.format('MM-YYYY')
                              : true
                          )}
                        renderItem={(debt, i) => {
                          return (
                            <List.Item
                              actions={[
                                <p key='list-price'>{`${debt.amount.price} ${debt.amount.currency}`}</p>,
                              ]}
                            >
                              <List.Item.Meta
                                title={`${
                                  debt.type === 'extra' ? 'Extra:' : 'Plan:'
                                }  ${debt.name}`}
                              />
                              <DatePicker
                                format='DD-MM-YYYY'
                                defaultValue={moment(debt.date)}
                                disabled
                              />
                            </List.Item>
                          );
                        }}
                      ></List>
                    </Col>
                    <Col md={24} lg={12}>
                      <List
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                        header={<div>Payments Recieved</div>}
                        footer={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>Total:</div>
                            <div>{`${payedTotal} $`}</div>
                          </div>
                        }
                        size='small'
                        bordered
                        dataSource={client.payments
                          .sort((a, b) => (a.date < b.date ? -1 : 1))
                          .filter((payment) =>
                            month
                              ? moment(payment.date).format('MM-YYYY') ===
                                month.format('MM-YYYY')
                              : true
                          )}
                        renderItem={(payment, i) => {
                          return (
                            <List.Item
                              actions={[
                                <p key='list-price'>{`${payment.amount.price} ${payment.amount.currency}`}</p>,
                              ]}
                            >
                              <List.Item.Meta
                                title={`${payment.description}`}
                              />
                              <DatePicker
                                format='DD-MM-YYYY'
                                defaultValue={moment(payment.date)}
                                disabled
                              />
                            </List.Item>
                          );
                        }}
                      ></List>
                    </Col>
                  </Row>
                </Descriptions.Item>
                <Descriptions.Item
                  label={`${
                    month ? month.format('MMMM YYYY') : 'Total'
                  } Balance`}
                >
                  <List>
                    <List.Item
                      actions={[
                        <Text
                          key='total-debt'
                          type='danger'
                        >{`- ${debtTotal} $`}</Text>,
                      ]}
                    >
                      <List.Item.Meta title={`Consumed by Client`} />
                    </List.Item>
                    <List.Item
                      actions={[
                        <Text
                          key='total-payed'
                          type={payedTotal ? '' : 'warning'}
                        >{`+ ${payedTotal} $`}</Text>,
                      ]}
                    >
                      <List.Item.Meta title={`Payed by Client`} />
                    </List.Item>
                    <List.Item
                      actions={[
                        <Text
                          key='total-balance'
                          type={payedTotal - debtTotal > 0 ? '' : 'danger'}
                        >{`${payedTotal - debtTotal} $`}</Text>,
                      ]}
                    >
                      <List.Item.Meta title={`Total:`} />
                    </List.Item>
                  </List>
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : (
            'ERROR LOADING '
          )}
          <Row>
            <Col span={8} offset={8}>
              <Button
                style={{ margin: '30px 0 0 ' }}
                block
                onClick={() => showModal(setVisibleSubForm)}
              >
                Add Subscription
              </Button>
              <Modal
                centered
                title='Add Subscription'
                visible={visibleSubForm}
                confirmLoading={confirmLoading}
                onCancel={() => handleCancel(setVisibleSubForm)}
                footer={[
                  <Button
                    key='back'
                    onClick={() => handleCancel(setVisibleSubForm)}
                  >
                    Cancel
                  </Button>,
                ]}
              >
                <SubscriptionForm
                  onSubmit={onSubmitSub}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  methods={methods}
                />
              </Modal>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Button
                style={{ margin: '30px 0 0 ' }}
                block
                onClick={() => showModal(setVisiblePaymentForm)}
              >
                Add Payment Info
              </Button>
              <Modal
                centered
                title='Add Payment'
                visible={visiblePaymentForm}
                confirmLoading={confirmLoading}
                onCancel={() => handleCancel(setVisiblePaymentForm)}
                footer={[
                  <Button
                    key='back'
                    onClick={() => handleCancel(setVisiblePaymentForm)}
                  >
                    Cancel
                  </Button>,
                ]}
              >
                <PaymentForm
                  onSubmit={onSubmit}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  methods={methods}
                />
              </Modal>
            </Col>
          </Row>
        </LayoutTemplate>
      );
    }),
    { type: 'coordinator' }
  )
);

const PaymentForm = ({ onSubmit, handleSubmit, errors, methods }) => {
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
          width: 70,
        }}
        name='currency'
      />
    </Form.Item>
  );
  return (
    <FormContext {...methods}>
      <Form>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.description?.message ? 'error' : 'success'}
          help={errors.description?.message && errors.description.message}
        >
          <Controller
            as={Input}
            name='description'
            placeholder={`Provide a description for the payment`}
            rules={{
              required: 'Please, input the description',
            }}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.paymentAmount?.message ? 'error' : 'success'}
          help={errors.paymentAmount?.message && errors.paymentAmount.message}
        >
          <Controller
            name='paymentAmount'
            type='number'
            step={0.01}
            as={Input}
            placeholder='Amount'
            addonAfter={currencySelector}
            style={{
              width: '100%',
            }}
            rules={{
              required: 'Please input the payment amount!',
              min: { value: 0.01, message: 'Input a valid amount!' },
            }}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.paymentDate ? 'error' : 'success'}
          help={errors.paymentDate && 'Select the date of payment!'}
        >
          <Controller
            style={{
              width: '100%',
            }}
            placeholder={`Select date`}
            as={DatePicker}
            rules={{
              required: 'Select the date!',
            }}
            format='DD-MM-YYYY'
            name={`paymentDate`}
          />
        </Form.Item>

        <Form.Item {...formItemLayout}>
          <Button
            type='primary'
            htmlType='submit'
            onClick={handleSubmit(onSubmit)}
          >
            Add Payment!
          </Button>
        </Form.Item>
      </Form>
    </FormContext>
  );
};

const SubscriptionForm = ({ onSubmit, handleSubmit, errors, methods }) => {
  const { loading } = useContext(UserContext);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);

  useEffect(() => {
    if (!loading) {
      fetchPlans();
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

  return (
    <FormContext {...methods}>
      <Form>
        <Form.Item
          {...formItemLayout}
          required={true}
          validateStatus={errors.name?.message ? 'error' : 'success'}
          help={errors.name?.message && errors.name.message}
        >
          <Controller
            as={Input}
            type='text'
            placeholder='Name'
            name='name'
            rules={{
              required: 'Required',
            }}
          />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          validateStatus={errors.planName?.type ? 'error' : 'success'}
          help={errors.planName?.type && 'Please, select at least 1 plan!'}
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
                      <Option value={plan.name} key={i}>{`${plan.name} - ${
                        plan.price.price
                      } ${plan.price.currency || '$'}`}</Option>
                    );
                  })}
              </Select>
            }
            rules={{
              validate: (value) => value.length > 0,
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
              help={errors.dates && 'Provide the dates for all the plans!'}
            >
              <Controller
                style={{
                  width: '100%',
                }}
                placeholder={`Select ${plan} date`}
                as={DatePicker}
                rules={{
                  validate: (value) => value !== null,
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
            onClick={handleSubmit(onSubmit)}
          >
            Add Subscription!
          </Button>
        </Form.Item>
      </Form>
    </FormContext>
  );
};
