import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  DesktopOutlined,
  LogoutOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';
import { doLogout, UserContext } from '../../../lib/auth.api';

export const LayoutTemplate = ({ children, sider = false, currentPage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {sider ? (
        <>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div style={{ height: '50px' }}></div>
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
      <SubMenu
        key='User'
        title={
          <>
            <UserOutlined />
            <span className='nav-text'>User</span>
          </>
        }
      >
        <Menu.Item key='Profile'>
          <span className='nav-text'>
            <ProfileOutlined />
            <span>Profile</span>
          </span>
        </Menu.Item>
        <Menu.Item
          key='Logout'
          onClick={async () => {
            setUser();
            await doLogout();
            history.push('/');
          }}
        >
          <LogoutOutlined />
          <span>Logout</span>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key='/company'
        title={
          <>
            <DesktopOutlined />
            <span className='nav-text'>Company</span>
          </>
        }
      >
        <Menu.Item key='subscriptionsList'>
          <Link to='/company/subscriptions' className='nav-text'>
            Subscriptions
          </Link>
        </Menu.Item>
        <Menu.Item key='clientsList'>
          <Link to='/company/clients' className='nav-text'>
            Clients
          </Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key='Chat'>
        <span className='nav-text'>
          <span>Chat</span>
        </span>
      </Menu.Item>
    </Menu>
  );
});
