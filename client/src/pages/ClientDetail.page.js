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
  Spin,
} from 'antd';
const { Option } = Select;
const { Text } = Typography;
import '../../public/css/form';
import moment from 'moment';
import { SpinIcon } from '../../lib/loading';
import { formItemLayout, PageSpinner } from './utils/styles';
import { SiderMenu } from '../components/Layout/Menu';

export const ClientDetailPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { loading, setLoading, user } = useContext(UserContext);
      const [client, setClient] = useState();
      const [month, setMonth] = useState();
      const [debtTotal, setDebtTotal] = useState(0);
      const [payedTotal, setPayedTotal] = useState(0);
      const [spinner, setSpinner] = useState(true);

      useEffect(() => {
        if (!loading) {
          fetchClient(user._id);
        }
      }, []);

      const fetchClient = (id) => {
        setSpinner(true);
        getSingleClient(id)
          .then((client) => {
            setClient(client);
            calculateTotal(client.debts, null, setDebtTotal);
            calculateTotal(client.payments, null, setPayedTotal);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setSpinner(false));
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
            .toFixed(2)
        );
      };

      return (
        <LayoutTemplate sider currentPage='details'>
          {client ? (
            <>
              <Descriptions
                title={<div style={{ textAlign: 'center' }}>Details</div>}
                bordered
                column={1}
                layout='vertical'
              >
                <Descriptions.Item label='Your Subscriptions'>
                  <List
                    size='small'
                    bordered
                    dataSource={client.subscriptions}
                    renderItem={(sub) => (
                      <List.Item
                        actions={[
                          <Link
                            key='list-loadmore-review'
                            to={`/client/subscriptions/${sub._id}`}
                          >
                            Review
                          </Link>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Link to={`/client/subscriptions/${sub._id}`}>
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
                  <Row gutter={[16, { xs: 16, s: 16, md: 16, lg: 24 }]}>
                    <Col s={24} md={24} lg={12}>
                      <List
                        className='paymentList'
                        header={<div>Services Adquired</div>}
                        footer={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>Total:</div>
                            <div>{`${debtTotal} €`}</div>
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
                              style={{ marginBottom: 'auto' }}
                              actions={[
                                <p key='list-price'>{`${debt.amount.price} ${debt.amount.currency}`}</p>,
                              ]}
                            >
                              <List.Item.Meta
                                title={`${
                                  debt.type === 'extra' ? 'Extra:' : 'Plan:'
                                }  ${debt.name}`}
                                description={`${debt.subscription}`}
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
                        className='paymentList'
                        header={<div>Payments Made</div>}
                        footer={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>Total:</div>
                            <div>{`${payedTotal} €`}</div>
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
                        >{`- ${debtTotal} €`}</Text>,
                      ]}
                    >
                      <List.Item.Meta title={`You've consumed: `} />
                    </List.Item>
                    <List.Item
                      actions={[
                        <Text
                          key='total-payed'
                          type={payedTotal ? '' : 'warning'}
                        >{`+ ${payedTotal} €`}</Text>,
                      ]}
                    >
                      <List.Item.Meta title={`You've payed: `} />
                    </List.Item>
                    <List.Item
                      actions={[
                        <Text
                          key='total-balance'
                          type={payedTotal - debtTotal > 0 ? '' : 'danger'}
                        >{`${(payedTotal - debtTotal).toFixed(2)} €`}</Text>,
                      ]}
                    >
                      <List.Item.Meta title={`Total:`} />
                    </List.Item>
                  </List>
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : (
            <PageSpinner>
              <Spin size='large' indicator={SpinIcon} />
            </PageSpinner>
          )}
        </LayoutTemplate>
      );
    }),
    { type: 'client' }
  )
);
