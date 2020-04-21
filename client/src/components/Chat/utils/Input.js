import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const MessageInput = ({ onMessage }) => {
  const [msg, setMsg] = useState('');

  const handleSend = () => {
    if (msg != '') {
      onMessage(msg);
      setMsg('');
    } else {
      console.error('blank message');
    }
  };

  return (
    <Input
      onPressEnter={() => handleSend()}
      value={msg}
      onChange={(e) => setMsg(e.target.value)}
      placeholder='Your message'
      addonAfter={<SendOutlined onClick={handleSend} />}
    />
  );
};
