import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { gold } from '@ant-design/colors';

import { generate, presetPalettes } from '@ant-design/colors';

// Generate color palettes by a given color
const colors = generate('#d66122');

export const LayoutTemplate = ({ children, sider = false }) => {
  return (
    <Layout style={{ height: '100vh' }}>
      {sider ? (
        <>
          <Sider style={{ backgroundColor: colors[5] }}></Sider>
          <Layout style={{ height: '100vh' }}>
            <Content>{children}</Content>
            <Footer>Footer</Footer>
          </Layout>
        </>
      ) : (
        <>
          <Header style={{ backgroundColor: colors[5] }}>Header</Header>
          <Content>{children}</Content>
          <Footer>Footer</Footer>
        </>
      )}
    </Layout>
  );
};
