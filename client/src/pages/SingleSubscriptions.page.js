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
import { useForm, FormContext, Controller } from 'react-hook-form';
import {
  DatePicker,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Select,
  message,
  Spin,
} from 'antd';
const { Option } = Select;
import { SpinIcon } from '../../lib/loading';
import moment from 'moment';
import { PageSpinner } from './utils/styles';
import { SiderMenu } from '../components/Layout/Menu';

export const SingleSubscriptionPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState();
      const [visible, setVisible] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
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
          .finally(() => setSpinner(false));
      };

      const showModal = () => {
        setVisible(true);
      };

      const handleCancel = () => {
        setVisible(false);
      };

      const methods = useForm({
        mode: 'onBlur',
      });

      const { register, handleSubmit, errors, reset } = methods;

      const onSubmit = async (data) => {
        setConfirmLoading(true);
        try {
          const response = await addExtraOnSubscription(match.params.id, data);
          fetchSubscription(match.params.id);
          message.success(response.status);
        } catch (error) {
          message.error(error.response.data.status);
        } finally {
          setConfirmLoading(false);
          setVisible(false);
          reset();
        }
      };

      return (
        <LayoutTemplate sider>
          {data ? (
            <>
              <Descriptions
                title={`Subscription: ${data.name}`}
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
                {data.level && (
                  <Descriptions.Item label={`Level:`} span={2}>
                    {`${data.level}`}
                  </Descriptions.Item>
                )}
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
              <Row>
                <Col span={8} offset={8}>
                  <Button
                    style={{ margin: '30px 0 0 ' }}
                    block
                    onClick={() =>
                      history.push(
                        `/company/subscriptions/edit/${match.params.id}`
                      )
                    }
                  >
                    Edit Subscription
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={8} offset={8}>
                  <Button
                    style={{ margin: '30px 0 0 ' }}
                    block
                    onClick={() => showModal()}
                  >
                    Add Extra
                  </Button>
                  <Modal
                    centered
                    title='Add extra'
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onCancel={() => handleCancel()}
                    footer={[
                      <Button key='back' onClick={() => handleCancel()}>
                        Cancel
                      </Button>,
                    ]}
                  >
                    <ExtraForm
                      onSubmit={onSubmit}
                      handleSubmit={handleSubmit}
                      errors={errors}
                      methods={methods}
                    />
                  </Modal>
                </Col>
              </Row>
            </>
          ) : (
            <PageSpinner>
              <Spin size='large' indicator={SpinIcon} />
            </PageSpinner>
          )}
        </LayoutTemplate>
      );
    }),
    { type: 'coordinator' }
  )
);

const ExtraForm = ({ onSubmit, handleSubmit, errors, methods }) => {
  const { loading, setLoading } = useContext(UserContext);
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    if (!loading) {
      fetchExtras();
    }
  }, []);

  const fetchExtras = () => {
    getExtras()
      .then((extras) => {
        setExtras(extras);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16, offset: 4 },
    },
  };

  return (
    <FormContext {...methods}>
      <Form>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.extrasName ? 'error' : 'success'}
          help={errors.extrasName && errors.extrasName.message}
        >
          <Controller
            rules={{
              required: 'Select the extra!',
            }}
            as={
              <Select placeholder='Select an Extra'>
                {extras &&
                  extras.map((extra, i) => {
                    return (
                      <Option value={extra.name} key={i}>{`${extra.name} - ${
                        extra.price.price
                      } ${extra.price.currency || '$'}`}</Option>
                    );
                  })}
              </Select>
            }
            name={`extraName`}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          validateStatus={errors.extraDate ? 'error' : 'success'}
          help={errors.extraDate && 'Select the date!'}
        >
          <Controller
            style={{
              width: '100%',
            }}
            placeholder={`Select date`}
            as={DatePicker}
            rules={{
              required: 'Select the date!',
            }}
            format='DD-MM-YYYY'
            name={`extraDate`}
          />
        </Form.Item>

        <Form.Item {...formItemLayout}>
          <Button
            type='primary'
            htmlType='submit'
            onClick={handleSubmit(onSubmit)}
          >
            Update Subscription!
          </Button>
        </Form.Item>
      </Form>
    </FormContext>
  );
};
