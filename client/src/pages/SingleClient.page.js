import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  UserContext,
  getSingleSubscription,
  getExtras,
  addExtraOnSubscription,
  getSingleClient
} from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { Descriptions } from 'antd';
import { useForm, FormContext, Controller } from 'react-hook-form';
import {
  DatePicker,
  Button,
  Row,
  Col,
  Divider,
  List,
  Select,
  Space
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

      useEffect(() => {
        if (!loading) {
          fetchClient(match.params.id);
        }
      }, []);

      const fetchClient = id => {
        getSingleClient(id)
          .then(sub => {
            setData(sub);
          })
          .catch(err => {
            console.log(err);
          });
      };
      console.log(data && data.subscriptions.map(sub => console.log(sub)));
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
                <Descriptions.Item label='Balance'></Descriptions.Item>
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
