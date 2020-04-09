import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Layout, Menu } from 'antd';
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';
import { doLogout, UserContext } from '../../../lib/auth.api';

// Generate color palettes by a given color
const colors = generate('#d66122');

export const LayoutTemplate = ({ children, sider = false, currentPage }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }} theme='light'>
      {sider ? (
        <>
          <Sider
            width={200}
            style={{
              margin: 0,
              minHeight: '100vh',
              background: '#000'
            }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          >
            <SiderMenu selection={currentPage} history={history} />
          </Sider>
          <Layout style={{ minHeight: '100vh' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: '#fff'
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
              margin: 0,
              minHeight: 280
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
    <Menu
      mode='inline'
      style={{ height: '100%', borderRight: 0, background: '#000' }}
      theme='dark'
      defaultSelectedKeys={[selection]}
    >
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
