import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0%;
  z-index: 10000;
  background: rgba(255, 255, 255, 0.5);
`;
const Icon = <SyncOutlined spin style={{ fontSize: 50 }} spin />;
export const Loading = () => (
  <LoadingWrapper>
    <Spin size='large' indicator={Icon} />
  </LoadingWrapper>
);
