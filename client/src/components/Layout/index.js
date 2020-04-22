import React, { useState, useContext } from 'react';
import { Layout, Drawer } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { UserContext } from '../../../lib/auth.api';
import { SiderMenu } from './Menu';
import styled from 'styled-components';
export const LayoutTemplate = ({
  children,
  sider = false,
  currentPage,
  currentMenuTab,
}) => {
  const { user } = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);
  const [visible, setVisible] = useState(false);
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
            breakpoint='md'
            onBreakpoint={(broken) => {
              setBroken(broken);
            }}
          >
            <div style={{ height: '10px' }}></div>
            <SiderMenu
              currentMenuTab={currentMenuTab}
              currentPage={currentPage}
              broken={broken}
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
          <StyledBurger visible={visible} onClick={() => setVisible(!visible)}>
            <div />
            <div />
            <div />
          </StyledBurger>
          <Drawer
            placement='left'
            closable={false}
            onClose={() => setVisible(false)}
            visible={visible}
          >
            <div style={{ height: '50px' }}></div>
            <SiderMenu
              currentMenuTab={currentMenuTab}
              currentPage={currentPage}
            />
          </Drawer>
          <Content
            style={{
              padding: 30,
              margin: 0,
              background: !user
                ? 'linear-gradient(150deg,rgba(33, 6, 94, 1) 0%,rgba(33, 6, 94, 1) 40%, rgba(83, 29, 171, 1) 100%)'
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

export const StyledBurger = styled.button`
  position: absolute;
  top: 5%;
  left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 99999999;

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.15rem;
    background: ${({ visible }) => (!visible ? '#531dab' : '#ffffff')};
    border-radius: 10px;
    transition: all 0.1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    position: relative;
    transform-origin: 1px;
    :first-child {
      transform: ${({ visible }) => (visible ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ visible }) => (visible ? '0' : '1')};
      transform: ${({ visible }) =>
        visible ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ visible }) => (visible ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;
