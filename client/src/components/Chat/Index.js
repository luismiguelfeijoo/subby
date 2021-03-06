import React, { useRef, useContext } from 'react';
import styled from 'styled-components';
import { useChatService } from './utils/Service';
import { MessageInput } from './utils/Input';
import { UserContext } from '../../../lib/auth.api';

const ChatDeco = styled.div`
  width: 100%;
`;

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
  height: ${({ page }) => (page === 'local' ? '90vh' : '76vh')};
  padding-bottom: 15px;
`;

export const Message = styled.div`
  background: ${({ type }) =>
    type == 'server'
      ? 'linear-gradient(60deg,rgba(33, 6, 94, 1) 0%,rgba(83, 29, 171, 1) 100%);'
      : 'linear-gradient(60deg,rgba(255,255,255, 1) 0%,rgba(211,211,211, 1) 100%);'};
  color: ${({ type }) => (type == 'server' ? 'white' : 'black')};
  border-radius: 10px;
  padding: 6px 10px;
  margin: ${({ type }) =>
    type == 'server' ? '3px 20px 3px 10px' : '3px 10px 3px 20px'};
  align-self: ${({ type }) => (type == 'server' ? 'flex-start' : 'flex-end')};
  display: block;
  word-wrap: break-word;
  text-overflow: ellipsis;
  max-width: 85%;
`;

export const Chat = ({ id }) => {
  // Use ref to messages div
  const { user } = useContext(UserContext);
  const msgRef = useRef();

  // The Chat service :)
  const { sendMessage, messages } = useChatService(() => {
    // Scroll the messages to end
    msgRef.current
      ? (msgRef.current.scrollTop = msgRef.current.scrollHeight)
      : '';
  }, id);

  return (
    <ChatDeco>
      <MessagesWrapper
        ref={msgRef}
        page={String(id) !== String(user._id) ? 'local' : 'client'}
      >
        {messages.map((message, i) => (
          <Message key={i} type={message.type}>
            {message.text}
          </Message>
        ))}
      </MessagesWrapper>
      <MessageInput onMessage={sendMessage} />
    </ChatDeco>
  );
};

/*
height: 75vh;
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
    */
