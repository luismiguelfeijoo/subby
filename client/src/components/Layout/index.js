import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  DesktopOutlined,
  LogoutOutlined,
  FileSearchOutlined,
  MessageOutlined,
  AuditOutlined,
  EditOutlined,
  UserOutlined,
  ProfileOutlined,
  PlusOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Layout, Menu, notification } from 'antd';
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;
import { doLogout, UserContext } from '../../../lib/auth.api';

export const LayoutTemplate = ({
  children,
  sider = false,
  currentPage,
  currentMenuTab,
}) => {
  const { user } = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {sider && !broken ? (
        <>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            breakpoint='lg'
            onBreakpoint={(broken) => {
              setBroken(broken);
            }}
          >
            <div style={{ height: '10px' }}></div>
            <SiderMenu
              selection={currentPage}
              history={history}
              open={currentMenuTab}
            />
          </Sider>
          <Layout style={{ minHeight: '100vh' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: '100vh',
              }}
            >
              {children}
            </Content>
          </Layout>
        </>
      ) : (
        <>
          <Header>
            <SiderMenu
              selection={currentPage}
              history={history}
              option={currentMenuTab}
              broken
            />
          </Header>
          <Content
            style={{
              padding: 30,
              margin: 0,
              background: !user
                ? 'linear-gradient(rgba(33, 6, 94, 1) 0%, rgba(83, 29, 171, 1) 50%, rgba(255, 255, 255, 1) 100%)'
                : '',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {children}
          </Content>
          {!user && (
            <Footer style={{ textAlign: 'center', color: '#391085' }}>
              S U B B Y © 2020 Created by Luismi
            </Footer>
          )}
        </>
      )}
    </Layout>
  );
};

const SiderMenu = withRouter(({ selection, history, open, broken }) => {
  const { user, setUser, notifications, setNotifications, socket } = useContext(
    UserContext
  );

  return (
    <>
      {user ? (
        user.type ? (
          <Menu
            mode={broken ? 'horizontal' : 'inline'}
            defaultSelectedKeys={[selection]}
            defaultOpenKeys={[open]}
            theme='dark'
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
                  <span className='nav-text'>Add User</span>
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
              <Link
                to='/chat'
                onClick={() => {
                  if (notifications.active) {
                    setNotifications({ active: false });
                    socket.emit('readNotification', notifications.data);
                  }
                }}
              >
                <ChatIcon notifications={notifications} />
                <span className='nav-text'>Chat</span>
              </Link>
            </Menu.Item>
          </Menu>
        ) : (
          <Menu
            mode={broken ? 'horizontal' : 'inline'}
            defaultSelectedKeys={[selection]}
            defaultOpenKeys={[open]}
            theme='dark'
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
            <Menu.Item key='subscriptionsList'>
              <Link to='/client/subscriptions' className='nav-text'>
                <FileSearchOutlined />
                <span className='nav-text'>Subscriptions</span>
              </Link>
            </Menu.Item>
            <Menu.Item
              key='Chat'
              onClick={() => {
                if (notifications.active) {
                  setNotifications({ active: false });
                  socket.emit('readNotification', notifications.data);
                }
              }}
            >
              <Link to='/chat'>
                <ChatIcon notifications={notifications} />
                <span className='nav-text'>Chat</span>
              </Link>
            </Menu.Item>
          </Menu>
        )
      ) : (
        <Menu mode='horizontal' theme='dark'>
          <Menu.Item key='home'>
            <Link to='/' className='nav-text'>
              <span className='nav-text'>S U B B Y</span>
            </Link>
          </Menu.Item>
        </Menu>
      )}
    </>
  );
});

import styled from 'styled-components';

const DotContainer = styled.div`
  position: relative;
  width: 20px;
  span {
    position: static;
  }
`;

const Dot = styled.div`
  background-color: #fa3e3e;
  border-radius: 50%;
  color: white;

  padding: 5px;
  font-size: 10px;

  position: absolute; /* Position the badge within the relatively positioned button */
  top: 10px;
  left: 10px;
`;

const ChatIcon = ({ notifications }) => {
  return (
    <>
      {notifications.active ? (
        <DotContainer>
          <MessageOutlined />
          <Dot />
          <span className='nav-text'>Chat</span>
        </DotContainer>
      ) : (
        <MessageOutlined />
      )}
    </>
  );
};

/* 

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';
*/
