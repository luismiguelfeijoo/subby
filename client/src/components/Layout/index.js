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
    <Layout style={{ height: '100vh' }}>
      {sider ? (
        <>
          <Sider
            width={200}
            style={{
              backgroundColor: colors[5],
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
            trigger={null}
            collapsible
            collapsed={collapsed}
          ></Sider>
          <Layout style={{ height: '100vh' }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280
              }}
            >
              {children}
            </Content>
          </Layout>
        </>
      ) : (
        <>
          <Header style={{ backgroundColor: colors[5] }}>Header</Header>
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
