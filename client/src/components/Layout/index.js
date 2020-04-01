import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { gold } from '@ant-design/colors';

export const LayoutTemplate = ({ children, sider = false }) => {
  return (
    <Layout style={{ height: '100vh' }}>
      {sider ? (
        <Sider>
          <Header style={{ backgroundColor: gold.primary }}>Header</Header>
          <Content>{children}</Content>
          <Footer>Footer</Footer>
        </Sider>
      ) : (
        <>
          <Header style={{ backgroundColor: gold.primary }}>Header</Header>
          <Content>{children}</Content>
          <Footer>Footer</Footer>
        </>
      )}
    </Layout>
  );
};
