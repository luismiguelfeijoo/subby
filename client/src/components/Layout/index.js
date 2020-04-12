import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';
import { doLogout, UserContext } from '../../../lib/auth.api';

export const LayoutTemplate = ({ children, sider = false, currentPage }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {sider ? (
        <>
          <Sider width={200} collapsible collapsed={collapsed}>
            <SiderMenu selection={currentPage} history={history} />
          </Sider>
          <Layout style={{ minHeight: '100vh' }}>
            <Content
              style={{
                padding: 24,
                margin: 0
              }}
            >
              {children}
            </Content>
          </Layout>
        </>
      ) : (
        <>
          <Header>Header</Header>
          <Content
            style={{
              padding: 24,
              margin: 0
            }}
          >
            {children}
          </Content>
          <Footer>Footer</Footer>
        </>
      )}
    </Layout>
  );
};

const SiderMenu = withRouter(({ selection, history }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Menu mode='inline' defaultSelectedKeys={[selection]}>
      <SubMenu key='User' title='User'>
        <Menu.Item key='Profile' onSelect={() => <Redirect to='profile' />}>
          Profile
        </Menu.Item>
        <Menu.Item
          key='Logout'
          onClick={async () => {
            setUser();
            await doLogout();
            history.push('/');
          }}
        >
          Log Out
        </Menu.Item>
      </SubMenu>
      <SubMenu key='/company' title='Company'>
        <Menu.Item key='subscriptionsList'>
          <Link to='/company/subscriptions'>Subscriptions</Link>
        </Menu.Item>
        <Menu.Item key='clientsList'>
          <Link to='/company/clients'>Clients</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
});
