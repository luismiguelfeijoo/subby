import React, { useState, useContext, useEffect, useRef } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  UserContext,
  getCompany,
  createExtra,
  createPlan
} from '../../lib/auth.api';
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
  message,
  Descriptions,
  List
} from 'antd';

import { formItemLayout } from './utils/styles';
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

      const { register, handleSubmit, errors, reset } = methods;

      const onSubmitPlan = async data => {
        console.log(data);
        try {
          const response = await createPlan(data);
          message.success(response.status);
          fetchCompany();
        } catch (error) {
          console.log(error);
        } finally {
          reset();
          setVisiblePlan(false);
        }
      };
      const onSubmitExtra = async data => {
        console.log(data);

        try {
          const response = await createExtra(data);
          message.success(response.status);
          fetchCompany();
        } catch (error) {
          console.log(error);
        } finally {
          reset();
          setVisibleExtra(false);
        }
      };

      return (
        <LayoutTemplate
          sider
          currentPage='companyProfile'
          currentMenuTab='company'
        >
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
                      description={`${plan.price.price} ${plan.price.currency}`}
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
                      description={`${extra.price.price} ${extra.price.currency}`}
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
                Add Plan
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
              >
                <TemplateForm
                  methods={methods}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmitPlan}
                  type={'plan'}
                  errors={errors}
                />
              </Modal>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Button
                style={{ margin: '30px 0 0 ' }}
                block
                onClick={() => setVisibleExtra(true)}
              >
                Add Extra
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
              >
                <TemplateForm
                  methods={methods}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmitExtra}
                  type={'extra'}
                  errors={errors}
                />
              </Modal>
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

const TemplateForm = ({ onSubmit, handleSubmit, errors, methods, type }) => {
  const { loading, setLoading } = useContext(UserContext);

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16, offset: 4 }
    }
  };

  const currencySelector = (
    <Form.Item noStyle>
      <Controller
        as={
          <Select>
            <Option value='€'>€</Option>
            <Option value='$'>$</Option>
          </Select>
        }
        defaultValue='€'
        style={{
          width: 70
        }}
        name='currency'
      />
    </Form.Item>
  );

  return (
    <FormContext {...methods}>
      <Form>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.name?.message ? 'error' : 'success'}
          help={errors.name?.message && errors.name.message}
        >
          <Controller
            as={Input}
            name='name'
            placeholder={`Provide a description for the ${type}`}
            rules={{
              required: 'Please, input the name'
            }}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.price?.message ? 'error' : 'success'}
          help={errors.price?.message && errors.price.message}
        >
          <Controller
            name='price'
            type='number'
            step={0.01}
            as={Input}
            placeholder='Price'
            addonAfter={currencySelector}
            style={{
              width: '100%'
            }}
            rules={{
              required: `Please input the price of the ${type}!`,
              min: { value: 0.01, message: 'Input a valid amount!' }
            }}
          />
        </Form.Item>

        <Form.Item {...formItemLayout}>
          <Button
            type='primary'
            htmlType='submit'
            onClick={handleSubmit(onSubmit)}
          >
            Add {`${type}`}!
          </Button>
        </Form.Item>
      </Form>
    </FormContext>
  );
};
