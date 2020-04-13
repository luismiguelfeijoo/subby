import React, { useState, useContext, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext, getCompany } from '../../lib/auth.api';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { useForm, FormContext, Controller } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Descriptions,
  List
} from 'antd';
import moment from 'moment';
const { Option } = Select;

export const CompanyProfilePage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { user, loading, setLoading } = useContext(UserContext);
      const [visibleExtra, setVisibleExtra] = useState(false);
      const [visiblePlan, setVisiblePlan] = useState(false);
      const [company, setCompany] = useState([]);

      useEffect(() => {
        if (!loading) {
          fetchCompany();
        }
      }, []);

      const fetchCompany = () => {
        getCompany()
          .then(company => {
            setCompany(company);
          })
          .catch(error => {
            console.log(error);
          });
      };

      const methods = useForm({
        mode: 'onBlur'
      });

      const { register, handleSubmit, errors } = methods;

      const onSubmit = async data => {
        console.log(data);
        /*
        setLoading(true);
        
        try {
          const response = await updateSubscription(match.params.id, data);
          history.push(`${match.url}`);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }*/
      };

      return (
        <LayoutTemplate sider>
          <Descriptions
            title={<div style={{ textAlign: 'center' }}>{company.name}</div>}
            bordered
            column={1}
            layout='vertical'
          >
            <Descriptions.Item label='Plans'>
              <List
                size='small'
                bordered
                dataSource={company.plans}
                renderItem={plan => (
                  <List.Item
                    actions={[
                      <Link key='list-loadmore-edit' to={`#`}>
                        edit
                      </Link>,
                      <Link
                        key='list-loadmore-delete'
                        onClick={e => console.log(plan._id)}
                        to='#'
                      >
                        delete
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      title={`
                     ${plan.name}
                    `}
                    />
                  </List.Item>
                )}
              />
            </Descriptions.Item>
            <Descriptions.Item label='Extras'>
              <List
                size='small'
                bordered
                dataSource={company.extras}
                renderItem={extra => (
                  <List.Item
                    actions={[
                      <Link key='list-loadmore-edit' to={`#`}>
                        edit
                      </Link>,
                      <Link
                        key='list-loadmore-delete'
                        onClick={e => console.log(extra._id)}
                        to='#'
                      >
                        delete
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      title={`
                     ${extra.name}
                    `}
                    />
                  </List.Item>
                )}
              />
            </Descriptions.Item>
          </Descriptions>
          <Row>
            <Col span={8} offset={8}>
              <Button
                style={{ margin: '30px 0 0 ' }}
                block
                onClick={() => setVisiblePlan(true)}
              >
                Add Payment Info
              </Button>
              <Modal
                centered
                title='Add New Plan'
                visible={visiblePlan}
                onCancel={() => setVisiblePlan(false)}
                footer={[
                  <Button key='back' onClick={() => setVisiblePlan(false)}>
                    Cancel
                  </Button>
                ]}
              ></Modal>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Button
                style={{ margin: '30px 0 0 ' }}
                block
                onClick={() => setVisibleExtra(true)}
              >
                Add Payment Info
              </Button>
              <Modal
                centered
                title='Add New Extra'
                visible={visibleExtra}
                onCancel={() => setVisibleExtra(false)}
                footer={[
                  <Button key='back' onClick={() => setVisibleExtra(false)}>
                    Cancel
                  </Button>
                ]}
              ></Modal>
            </Col>
          </Row>
        </LayoutTemplate>
      );
    }),
    {
      type: 'coordinator',
      redirectTo: '/login'
    }
  )
);
