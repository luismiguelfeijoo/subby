import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../../../../lib/auth.api';

export const ChatService = (handleMessage, user, id) => {
  console.log('Connecting websocket...');
  const socket = io(process.env.BACK_URL);

  socket.emit('auth', user, id);

  socket.on('chatHistory', (chatHistory) => {
    chatHistory.map((message) => {
      handleMessage(message);
    });
  });
  // recieve message
  socket.on('chatmessage', (message) => {
    console.log(message);
    handleMessage(message);
  });

  // send a message
  return (msg) => {
    console.log(`Sending message: "${msg}"`);
    socket.emit('chatmessage', msg);
    return true;
  };
};

export const useChatService = (onMessage, id) => {
  // The chat messagesstate holder
  const { loading } = useContext(UserContext);
  const [messages, setChatMessages] = useState([]);

  // The emitter holder
  const [sendMessage, setEmitter] = useState(() => {
    console.log('Server not connected');
    return false;
  });

  const { user } = useContext(UserContext);

  // Connect on component mounted
  useEffect(() => {
    // Start the chat service with handler to receive messages from websocket
    if (!loading) {
      const emitter = ChatService(
        (msg) => {
          const msgobj = {
            type: String(msg.user) === String(user._id) ? 'me' : 'server',
            text: msg.text,
          };
          // IMPORTANT: use a function, as setChatMessages can be stale
          setChatMessages((currentState) => [...currentState, msgobj]);
          //setChatMessages([...messages, msgobj]);
          onMessage(msg);
        },
        user,
        id
      );

      // NOTE: https://github.com/facebook/react/issues/14087
      // This is sendMessages
      setEmitter(() => (msg) => {
        // Emit websocket message
        emitter(msg);
        // Add to messages array
        const msgobj = { type: 'me', text: msg };
        setChatMessages((currentState) => [...currentState, msgobj]);
        onMessage(msgobj);
      });
    }
  }, []);

  return {
    messages,
    sendMessage,
  };
};
