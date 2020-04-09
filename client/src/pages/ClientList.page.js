import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getClients } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { List, Input, Divider, Button } from 'antd';
import { withTypeUser } from '../../lib/protectedTypeUser';

export const ClientListPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { loading } = useContext(UserContext);
      const [data, setData] = useState([]);
      const [filter, setFilter] = useState('');

      useEffect(() => {
        if (!loading) {
          fetchClients();
        }
      }, []);

      const fetchClients = () => {
        getClients().then(subs => {
          setData(subs);
        });
      };

      return (
        <LayoutTemplate sider={true}>
          <Input.Search
            placeholder='Search by name'
            onChange={event => setFilter(event.target.value)}
            style={{ width: '50%', margin: '10px' }}
          />
          <Button
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

          <Divider />

          <List
            itemLayout='horizontal'
            dataSource={data}
            renderItem={client =>
              client.name.first.toLowerCase().includes(filter.toLowerCase()) ||
              client.name.last.toLowerCase().includes(filter.toLowerCase()) ? (
                <List.Item
                  actions={[
                    <Link
                      key='list-loadmore-edit'
                      to={`/company/clients/${client._id}`}
                    >
                      edit
                    </Link>,
                    <Link
                      key='list-loadmore-more'
                      onClick={e => console.log(client._id)}
                      to='#'
                    >
                      delete
                    </Link>
                  ]}
                >
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
                          ? `${acc},  ${sub.name.first} ${sub.name.last}`
                          : `Subs: ${sub.name.first} ${sub.name.last}`;
                      }, '')
                    }
                  />
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
