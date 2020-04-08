import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getSingleSubscription } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { Descriptions } from 'antd';
import { DatePicker, Button, Row, Col } from 'antd';
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

      return (
        <LayoutTemplate sider={true}>
          {data ? (
            <>
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
                      </Descriptions.Item>
                    );
                  })}
                {data.extras &&
                  data.extras.map((extra, i) => {
                    return (
                      <Descriptions.Item
                        key={extra.id + i}
                        label={`Extra ${i + 1}:`}
                        span={2}
                      >
                        {`${extra.extra.name} - ${extra.extra.price.price} ${extra.extra.price.currency}`}
                        <br />
                        {`Date:  `}
                        <DatePicker
                          format='DD-MM-YYYY'
                          defaultValue={moment(extra.startDate)}
                          disabled
                        />
                      </Descriptions.Item>
                    );
                  })}
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
                  history.push(`/company/subscriptions/edit/${match.params.id}`)
                }
              >
                Edit Subscription
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Button style={{ margin: '30px 0 0' }} block>
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
