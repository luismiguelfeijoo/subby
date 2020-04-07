import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getSingleSubscription } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { Descriptions } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';

export const SingleSubscriptionPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState();

      useEffect(() => {
        if (!loading) {
          fetchSubscription(match.params.id);
        }
      }, []);

      const fetchSubscription = id => {
        getSingleSubscription(id)
          .then(sub => {
            setData(sub);
          })
          .catch(err => {
            console.log(err);
          });
      };
      console.log(data);
      return (
        <LayoutTemplate sider={true}>
          {data ? (
            <Descriptions
              title={`Subscription: ${data.name.first} ${data.name.last}`}
              bordered
              column={2}
            >
              {data.parents.map((parent, i) => {
                return (
                  <Descriptions.Item
                    key={parent.name + i}
                    label={`Client ${i + 1}:`}
                    span={2}
                  >
                    {`Name: ${parent.name.first} ${parent.name.last}`}
                    <br />
                    {`Email: ${parent.username}`}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          ) : (
            'ERROR LOADING '
          )}
        </LayoutTemplate>
      );
    }),
    { type: 'coordinator' }
  )
);
