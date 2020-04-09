import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { getSubscriptions } from '../../lib/auth.api';
import { List, Input } from 'antd';

export const SubscriptionListPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { loading } = useContext(UserContext);
      const [data, setData] = useState([]);
      const [filter, setFilter] = useState('');

      useEffect(() => {
        if (!loading) {
          fetchSubscriptions();
        }
      }, []);

      const fetchSubscriptions = () => {
        getSubscriptions().then(subs => {
          setData(subs);
        });
      };

      return (
        <LayoutTemplate sider={true}>
          <Input.Search
            placeholder='Search by name'
            onChange={event => setFilter(event.target.value)}
            style={{ width: '30%', margin: '10px' }}
          />

          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={sub =>
              sub.name.first.toLowerCase().includes(filter.toLowerCase()) ||
              sub.name.last.toLowerCase().includes(filter.toLowerCase()) ? (
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
                        {`${sub.name.first} ${sub.name.last}`}
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
