import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  UserContext,
  deleteClient,
  deleteSubscription
} from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { fetchSubscriptions } from './utils/helpers';
import { List, Input, Button, Space, Divider, Popover, message } from 'antd';

const { Search } = Input;

export const SubscriptionListPage = withProtected(
  withTypeUser(
    withRouter(({ match, history }) => {
      const { loading } = useContext(UserContext);
      const [data, setData] = useState([]);
      const [filter, setFilter] = useState('');

      useEffect(() => {
        if (!loading) {
          fetchSubscriptions(setData);
        }
      }, []);

      return (
        <LayoutTemplate sider={true} currentPage={'subscriptionsList'}>
          <Search
            placeholder='Search by name'
            onChange={event => setFilter(event.target.value)}
            style={{ width: '50%', marginRight: 10 }}
          />
          <Button
            onClick={() => {
              const newData = [...data];
              newData.sort((a, b) => {
                return a.name < b.name ? -1 : 1;
              });
              setData(newData);
            }}
            style={{ marginRight: 10 }}
          >
            Sort by Name
          </Button>
          <Button
            onClick={() => {
              const newData = [...data];
              newData.sort((a, b) => {
                return a.level < b.level ? -1 : 1;
              });
              setData(newData);
            }}
          >
            Sort by Level
          </Button>

          <Divider />

          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={sub =>
              sub.name.toLowerCase().includes(filter.toLowerCase()) ? (
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
                          <Link
                            to='#'
                            onClick={async () => {
                              try {
                                await deleteSubscription(sub._id);
                                fetchSubscriptions(setData);
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            Delete anyways
                          </Link>
                        </>
                      }
                    >
                      <Link to='#'>delete</Link>
                    </Popover>
                  ]}
                >
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
