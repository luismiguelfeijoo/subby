import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getClients } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Typography, List, Skeleton } from 'antd';
import { Chat } from '../components/Chat/Index';
import { SiderMenu } from '../components/Layout/Menu';

export const ChatPage = withProtected(
  withRouter(({ history }) => {
    const { user, loading } = useContext(UserContext);
    const [data, setData] = useState([]);
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
      <LayoutTemplate sider menu={<SiderMenu currentPage='chat' />}>
        {user.type ? (
          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={(client) => (
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
            )}
          />
        ) : (
          <Chat id={user._id}></Chat>
        )}
      </LayoutTemplate>
    );
  })
);
