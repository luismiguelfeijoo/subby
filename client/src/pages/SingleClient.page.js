import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getSingleClient } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { Descriptions } from 'antd';
import _ from 'lodash';
import {
  DatePicker,
  Button,
  Row,
  Col,
  Divider,
  List,
  Select,
  Card
} from 'antd';
const { Option } = Select;
import moment from 'moment';
import { SingleSubscriptionPage } from './SingleSubscriptions.page';

export const SingleClientPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState();
      const [visible, setVisible] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [month, setMonth] = useState();
      const [debtTotal, setDebtTotal] = useState(0);
      const [payedTotal, setPayedTotal] = useState(0);

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      useEffect(() => {
        if (!loading) {
          fetchClient(match.params.id);
        }
      }, []);

      const fetchClient = id => {
        getSingleClient(id)
          .then(sub => {
            setData(sub);
            calculateTotal(sub.debts, null, setDebtTotal);
          })
          .catch(err => {
            console.log(err);
          });
      };

      const calculateTotal = (data, month, setter) => {
        setter(
          data
            .filter(element =>
              month
                ? moment(element.date).format('MM-YYYY') ===
                  month.format('MM-YYYY')
                : true
            )
            .reduce((acc, element) => acc + parseInt(element.amount.price), 0)
        );
      };

      return (
        <LayoutTemplate sider={true}>
          {data ? (
            <>
              <Descriptions
                title={`Client: ${data.name.first} ${data.name.last}`}
                bordered
                column={1}
                layout='vertical'
              >
                <Descriptions.Item label='Subscriptions'>
                  <List
                    size='small'
                    bordered
                    dataSource={data.subscriptions}
                    renderItem={sub => (
                      <List.Item
                        actions={[
                          <Link
                            key='list-loadmore-edit'
                            to={`/company/subscriptions/edit/${sub._id}`}
                          >
                            edit
                          </Link>,
                          <Link
                            key='list-loadmore-more'
                            onClick={e => console.log(sub._id)}
                            to='#'
                          >
                            delete
                          </Link>
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Link to={`/company/subscriptions/${sub._id}`}>
                              {`${sub.name.first} ${sub.name.last} ${
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
                    onChange={e => {
                      setDebtTotal(0);
                      setMonth(() => (e ? e : e));
                      calculateTotal(data.debts, e, setDebtTotal);
                    }}
                  />
                  <Row>
                    <Col md={24} lg={12}>
                      <List
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                        header={<div>Services Adquired</div>}
                        footer={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>Total:</div>
                            <div>{`${debtTotal} $`}</div>
                          </div>
                        }
                        size='small'
                        bordered
                        dataSource={data.debts.filter(debt =>
                          month
                            ? moment(debt.date).format('MM-YYYY') ===
                              month.format('MM-YYYY')
                            : true
                        )}
                        renderItem={(debt, i) => {
                          return (
                            <List.Item
                              actions={[
                                <p key='list-price'>{`${debt.amount.price} ${debt.amount.currency}`}</p>
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
                          justifyContent: 'space-between'
                        }}
                        header={<div>Payments Recieved</div>}
                        footer={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>Total:</div>
                            <div>{`${payedTotal} $`}</div>
                          </div>
                        }
                        size='small'
                        bordered
                        dataSource={data.payments.filter(payment =>
                          month
                            ? moment(payment.date).format('MM-YYYY') ===
                              month.format('MM-YYYY')
                            : true
                        )}
                        renderItem={(payment, i) => {
                          return (
                            <List.Item
                              actions={[
                                <p key='list-price'>{`${payment.amount.price} ${payment.amount.currency}`}</p>
                              ]}
                            >
                              <List.Item.Meta title={`${payment.name}`} />
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
                      actions={[<p key='total-debt'>{`${debtTotal} $`}</p>]}
                    >
                      <List.Item.Meta title={`Debt Month`} />
                    </List.Item>
                    <List.Item
                      actions={[<p key='total-payed'>{`${payedTotal} $`}</p>]}
                    >
                      <List.Item.Meta title={`Payed Month`} />
                    </List.Item>
                    <List.Item
                      actions={[
                        <p key='total-balance'>{`${payedTotal -
                          debtTotal} $`}</p>
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
                onClick={() =>
                  history.push(`/company/clients/edit/${match.params.id}`)
                }
              >
                Edit Client
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Button style={{ margin: '30px 0 ' }} block>
                Set Payment Info
              </Button>
            </Col>
          </Row>
        </LayoutTemplate>
      );
    }),
    { type: 'coordinator' }
  )
);

/*
Use datepicker to show information depending on month
<DatePicker
  format='MM-YYYY'
  onChange={(date, dateS) => console.log(date, dateS)}
  picker='month'
/>;
*/
