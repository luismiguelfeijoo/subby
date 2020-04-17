import React, { useEffect, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Card, Col, Row, Button, Typography } from 'antd';
const { Title } = Typography;

export const HomePage = withProtected(
  withRouter(({ history }) => {
    const style = { margin: '10px 0' };
    const { user, setLoading } = useContext(UserContext);
    return (
      <LayoutTemplate>
        <Row gutter={16}>
          <Col xs={24} md={{ span: 10, offset: 12 }}>
            <Card
              style={{
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Title level={4} style={{ width: '80%' }}>
                S U B B Y is about helping you manage your client's monthly
                subscriptions! We are a flexible platform (you can customize
                your plans and add as many clients and subs as you have!)
              </Title>
              <Title level={4} style={{ width: '100%' }}>
                What are you waiting for?
              </Title>
              <Col xs={24} md={15}>
                <Button
                  type='primary'
                  style={style}
                  block
                  onClick={() => history.push('/new-company')}
                >
                  Join Our Platform!
                </Button>
              </Col>

              <Title level={4} style={{ width: '100%', margin: '20px 0 10px' }}>
                Already registered?
              </Title>
              <Col xs={24} md={15}>
                <Button
                  type='primary'
                  style={style}
                  block
                  onClick={() => history.push('/login')}
                >
                  Login
                </Button>
              </Col>
            </Card>
          </Col>
        </Row>
      </LayoutTemplate>
    );
  }),
  {
    redirect: true,
    redirectTo: 'profile',
    inverted: true,
  }
);
