import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getClients } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import {
  Typography,
  List,
  Skeleton,
  Divider,
  Input,
  Button,
  Row,
  Col,
} from 'antd';
const { Title } = Typography;
const { Search } = Input;
import { Chat } from '../components/Chat/Index';
import { typeClient } from './utils/helpers';

export const ChatPage = withProtected(
  withRouter(({ history }) => {
    const { user, loading } = useContext(UserContext);
    const [data, setData] = useState([
      typeClient,
      typeClient,
      typeClient,
      typeClient,
    ]);
    const [filter, setFilter] = useState('');
    const [spinner, setSpinner] = useState(true);

    useEffect(() => {
      if (!loading && user.type) {
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
      <LayoutTemplate sider currentPage='chat'>
        {user.type ? (
          <>
            <Title style={{ textAlign: 'center' }} level={4}>
              Chat List
            </Title>
            <Divider />
            <Row gutter={16}>
              <Col xs={14} lg={18}>
                <Search
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
                client.name.first
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                client.name.last
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ? (
                  <List.Item>
                    <Skeleton loading={spinner} active>
                      <List.Item.Meta
                        title={
                          <Link to={`/chat/${client._id}`}>
                            {`${client.name.first} ${client.name.last}`}
                          </Link>
                        }
                      />
                    </Skeleton>
                  </List.Item>
                ) : (
                  <></>
                )
              }
            />
          </>
        ) : (
          <Chat id={user._id}></Chat>
        )}
      </LayoutTemplate>
    );
  })
);
