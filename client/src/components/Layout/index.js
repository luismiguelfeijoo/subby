import React, { useState } from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';

// Generate color palettes by a given color
const colors = generate('#d66122');

export const LayoutTemplate = ({ children, sider = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }} theme='light'>
      {sider ? (
        <>
          <Sider
            theme='dark'
            width={200}
            style={{
              padding: 24,
              margin: 0,
              minHeight: '100vh',
              background: '#000'
            }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          ></Sider>
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
