import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getClients, deleteClient } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import {
  List,
  Input,
  Divider,
  Button,
  Popover,
  Typography,
  Skeleton,
  Row,
  Col,
} from 'antd';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { typeClient } from './utils/helpers';
import { SiderMenu } from '../components/Layout/Menu';
const { Text, Title } = Typography;

export const ClientListPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { loading, setLoading } = useContext(UserContext);
      const [data, setData] = useState([
        typeClient,
        typeClient,
        typeClient,
        typeClient,
      ]);
      const [filter, setFilter] = useState('');
      const [spinner, setSpinner] = useState(true);

      useEffect(() => {
        if (!loading) {
          fetchClients();
        }
      }, []);

      const fetchClients = () => {
        setSpinner(true);
        getClients()
          .then((subs) => {
            setData(subs);
          })
          .finally(() => setSpinner(false));
      };

      return (
        <LayoutTemplate sider={true} currentPage='clientsList'>
          <Title style={{ textAlign: 'center' }} level={4}>
            Clients List
          </Title>
          <Divider />
          <Row gutter={16}>
            <Col xs={14} lg={18}>
              <Input.Search
                placeholder='Search by name'
                onChange={(event) => setFilter(event.target.value)}
                style={{ width: '100%', marginRight: 10 }}
              />
            </Col>
            <Col xs={10} lg={6}>
              <Button
                block
                onClick={() => {
                  const newData = [...data];
                  newData.sort((a, b) => {
                    return a.name.first < b.name.first ? -1 : 1;
                  });
                  setData(newData);
                }}
              >
                Sort by Name
              </Button>
            </Col>
          </Row>

          <Divider />

          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={(client) =>
              client.name.first.toLowerCase().includes(filter.toLowerCase()) ||
              client.name.last.toLowerCase().includes(filter.toLowerCase()) ? (
                <List.Item
                  actions={[
                    <Skeleton loading={spinner} active>
                      <Link
                        key='list-loadmore-edit'
                        to={`/company/clients/${client._id}`}
                      >
                        edit
                      </Link>
                    </Skeleton>,
                    <Skeleton loading={spinner} active>
                      <Popover
                        key='list-loadmore-delete'
                        title='Are you sure?'
                        trigger='click'
                        placement='topRight'
                        content={
                          <>
                            <p>This is a change you can't undo</p>
                            <Text
                              type='danger'
                              onClick={async () => {
                                try {
                                  await deleteClient(client._id);
                                  fetchClients();
                                } catch (error) {
                                  console.log(error);
                                }
                              }}
                            >
                              Delete anyways
                            </Text>
                          </>
                        }
                      >
                        <Link to='#'>delete</Link>
                      </Popover>
                    </Skeleton>,
                  ]}
                >
                  <Skeleton loading={spinner} active>
                    <List.Item.Meta
                      title={
                        <Link to={`/company/clients/${client._id}`}>
                          {`${client.name.first} ${client.name.last}`}
                        </Link>
                      }
                      description={
                        client.subscriptions.length > 0 &&
                        client.subscriptions.reduce((acc, sub) => {
                          return acc !== ''
                            ? `${acc},  ${sub.name}`
                            : `Subs: ${sub.name}`;
                        }, '')
                      }
                    />
                  </Skeleton>
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
