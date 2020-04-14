import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  DesktopOutlined,
  LogoutOutlined,
  FileSearchOutlined,
  FileOutlined,
  AuditOutlined,
  EditOutlined,
  UserOutlined,
  ProfileOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';
import { doLogout, UserContext } from '../../../lib/auth.api';

export const LayoutTemplate = ({
  children,
  sider = false,
  currentPage,
  currentMenuTab
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {sider ? (
        <>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            breakpoint='lg'
            onBreakpoint={broken => {
              setBroken(broken);
            }}
          >
            <div style={{ height: '50px' }}></div>
            <SiderMenu
              selection={currentPage}
              history={history}
              option={currentMenuTab}
            />
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
          <Header>
            <div style={{ width: '100px' }}></div>
          </Header>
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

const SiderMenu = withRouter(({ selection, history, open }) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
      {user ? (
        <Menu
          mode='inline'
          defaultSelectedKeys={[selection]}
          defaultOpenKeys={[open]}
        >
          <SubMenu
            key='User'
            title={
              <>
                <UserOutlined />
                <span className='nav-text'>
                  {user.type
                    ? user.type === 'admin'
                      ? 'Admin'
                      : 'Coordinator'
                    : 'Client'}
                </span>
              </>
            }
          >
            <Menu.Item key='profile'>
              <Link to='/profile'>
                <ProfileOutlined />
                <span>Profile</span>
              </Link>
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
            key='company'
            title={
              <>
                <DesktopOutlined />
                <span className='nav-text'>Company</span>
              </>
            }
          >
            <Menu.Item key='addUserOrPlan'>
              <Link to='/company/new-user' className='nav-text'>
                <PlusOutlined />
                <span className='nav-text'>Add User or Sub</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='companyProfile'>
              <Link to='/company/profile' className='nav-text'>
                <EditOutlined />
                <span className='nav-text'>Edit Company</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key='subscriptionsList'>
            <Link to='/company/subscriptions' className='nav-text'>
              <FileSearchOutlined />
              <span className='nav-text'>Subscriptions</span>
            </Link>
          </Menu.Item>
          <Menu.Item key='clientsList'>
            <Link to='/company/clients' className='nav-text'>
              <AuditOutlined />
              <span className='nav-text'>Clients</span>
            </Link>
          </Menu.Item>
          <Menu.Item key='Chat'>
            <span className='nav-text'>
              <span>Chat</span>
            </span>
          </Menu.Item>
        </Menu>
      ) : (
        <></>
      )}
    </>
  );
});
