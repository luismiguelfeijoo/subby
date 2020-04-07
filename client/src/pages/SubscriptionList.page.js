import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { getSubscriptions } from '../../lib/auth.api';
import { List } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';
const count = 5;

export const SubscriptionListPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { user, loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState([]);

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
          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={sub => (
              <List.Item
                actions={[
                  <Link
                    key='list-loadmore-edit'
                    to={`/company/subscriptions/${sub._id}`}
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
            )}
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
