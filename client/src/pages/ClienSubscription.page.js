import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  UserContext,
  getSingleSubscription,
  getExtras,
  addExtraOnSubscription,
} from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { Descriptions } from 'antd';
import { DatePicker, message, Spin } from 'antd';
import { SpinIcon } from '../../lib/loading';
import moment from 'moment';
import { PageSpinner } from './utils/styles';
import { NotFoundPage } from './NotFoundPage';

export const ClientSubscriptionsPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState();
      const [spinner, setSpinner] = useState(true);

      useEffect(() => {
        if (!loading) {
          fetchSubscription(match.params.id);
        }
      }, []);

      const fetchSubscription = (id) => {
        setSpinner(true);
        getSingleSubscription(id)
          .then((sub) => {
            setData(sub);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setSpinner(false);
          });
      };

      return (
        <>
          {data ? (
            <LayoutTemplate sider>
              <Descriptions
                title={`Subscription: ${data.name}`}
                bordered
                column={2}
              >
                {data.plans &&
                  data.plans.map((plan, i) => {
                    return (
                      <Descriptions.Item
                        key={plan.id + i}
                        label={`Plan ${i + 1}:`}
                        span={2}
                      >
                        {`${plan.plan.name} - ${plan.plan.price.price} ${plan.plan.price.currency}`}

                        <br />
                        {`Start Date:  `}
                        <DatePicker
                          format='DD-MM-YYYY'
                          defaultValue={moment(plan.startDate)}
                          disabled
                        />
                        {plan.endDate && (
                          <>
                            <br />
                            End Date:
                            <DatePicker
                              format='DD-MM-YYYY'
                              defaultValue={moment(plan.endDate)}
                              disabled
                            />
                          </>
                        )}
                      </Descriptions.Item>
                    );
                  })}
                {data.extras &&
                  data.extras
                    .sort((a, b) => (a.date < b.date ? -1 : 1))
                    .map((extra, i) => {
                      return (
                        <Descriptions.Item
                          key={extra.id + i}
                          label={`Extra ${i + 1}:`}
                          span={1}
                        >
                          {`${extra.extra.name} - ${extra.extra.price.price} ${extra.extra.price.currency}`}
                          <br />
                          {`Date:  `}
                          <DatePicker
                            format='DD-MM-YYYY'
                            defaultValue={moment(extra.date)}
                            disabled
                          />
                        </Descriptions.Item>
                      );
                    })}
              </Descriptions>
            </LayoutTemplate>
          ) : spinner ? (
            <PageSpinner>
              <Spin size='large' indicator={SpinIcon} />
            </PageSpinner>
          ) : (
            <NotFoundPage />
          )}
        </>
      );
    }),
    { type: 'client' }
  )
);
