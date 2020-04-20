import React, { useRef, useContext } from 'react';
import styled from 'styled-components';
import { useChatService } from './utils/Service';
import { MessageInput } from './utils/Input';
import { UserContext } from '../../../lib/auth.api';

const ChatDeco = styled.div`
  border: 1px solid red;
  width: 300px;
`;
const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 20px;
`;
export const Message = styled.div`
  background: ${({ type }) => (type == 'server' ? 'lightgreen' : 'lightgray')};
  border-radius: 10px;
  padding: 3px 10px;
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

  const msgRef = useRef();

  // The Chat service :)
  const { sendMessage, messages } = useChatService(() => {
    // Scroll the messages to end
    msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, id);
  console.log(msgRef);
  return (
    <ChatDeco>
      <MessagesWrapper ref={msgRef}>
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
