import React, { useState, useContext } from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { UserContext } from '../../../lib/auth.api';

export const LayoutTemplate = ({ children, sider = false, menu }) => {
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
            {menu}
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
          <Header>{menu}</Header>
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

/* 

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';
*/
