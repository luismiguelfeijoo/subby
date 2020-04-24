import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  UserContext,
  getSubscriptions,
  deleteSubscription,
} from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';

import {
  List,
  Input,
  Button,
  Divider,
  Popover,
  message,
  Typography,
  Skeleton,
  Row,
  Col,
} from 'antd';
import { typeSub } from './utils/helpers';
const { Text, Title } = Typography;
const { Search } = Input;

export const SubscriptionListPage = withProtected(
  withTypeUser(
    withRouter(({ match, history }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState([typeSub, typeSub, typeSub, typeSub]);
      const [filter, setFilter] = useState('');
      const [spinner, setSpinner] = useState(true);

      useEffect(() => {
        if (!loading) {
          fetchSubscriptions(setData);
        }
      }, []);

      const fetchSubscriptions = (setter) => {
        setSpinner(true);
        getSubscriptions()
          .then((subs) => {
            setter(subs.filter((sub) => sub.active));
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setSpinner(false));
      };

      return (
        <LayoutTemplate sider currentPage='subscriptionsList'>
          <Title style={{ textAlign: 'center' }} level={4}>
            Subscriptions List
          </Title>
          <Divider />
          <Row gutter={16}>
            <Col xs={14} lg={18}>
              <Input.Search
                placeholder='Search by name'
                onChange={(event) => setFilter(event.target.value)}
                style={{ width: '100%', marginRight: 10 }}
              />
            </Col>
            <Col span={10} lg={6}>
              <Button
                block
                onClick={() => {
                  const newData = [...data];
                  newData.sort((a, b) => {
                    return a.name < b.name ? -1 : 1;
                  });
                  setData(newData);
                }}
              >
                Sort by Name
              </Button>
            </Col>
          </Row>
          <Divider />

          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={(sub) =>
              sub.name.toLowerCase().includes(filter.toLowerCase()) ? (
                <List.Item
                  actions={[
                    <Skeleton loading={spinner} active>
                      <Link
                        key='list-loadmore-edit'
                        to={`/company/subscriptions/edit/${sub._id}`}
                      >
                        edit
                      </Link>
                    </Skeleton>,
                    <Skeleton loading={spinner} active>
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
                                try {
                                  const response = await deleteSubscription(
                                    sub._id
                                  );
                                  message.success(response.status);
                                  fetchSubscriptions(setData);
                                } catch (error) {
                                  message.error(error.response.data.status);
                                }
                              }}
                            >
                              Delete anyways
                            </Text>
                          </>
                        }
                      >
                        <Link to='#'>delete</Link>
                      </Popover>
                    </Skeleton>,
                  ]}
                >
                  <Skeleton loading={spinner} active>
                    <List.Item.Meta
                      title={
                        <Link to={`/company/subscriptions/${sub._id}`}>
                          {`${sub.name}`}
                        </Link>
                      }
                      description={
                        <>
                          <div>
                            {sub.parents.reduce((acc, parent) => {
                              return acc !== ''
                                ? `${acc}, ${parent.name.first} ${parent.name.last}`
                                : `Clients: ${parent.name.first} ${parent.name.last}`;
                            }, '')}
                          </div>
                          {sub.level && <div>Level: {sub.level}</div>}
                        </>
                      }
                    />
                  </Skeleton>
                </List.Item>
              ) : (
                <></>
              )
            }
          />
        </LayoutTemplate>
      );
    }),
    { type: 'coordinator' }
  )
);

/* <div>
                        Since:{'  '}
                        <DatePicker
                          format='DD-MM-YYYY'
                          defaultValue={moment(sub.plans[0].startDate)}
                          disabled
                        />
                      </div>*/
