import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../lib/auth.api';
import { notification } from 'antd';

export const ChatService = (
  handleMessage,
  handleNewMessage,
  id,
  socket,
  notifications,
  setNotifications
) => {
  //console.log('entering chat room');

  socket.emit('auth', id);

  if (notifications.active) {
    setNotifications({ active: false });
    socket.emit('updateNotification', notifications.data);
  }

  socket.on('chatHistory', (chatHistory) => {
    chatHistory.map((message) => {
      handleMessage(message);
    });
  });

  // recieve message
  socket.on('chatmessage', (message) => {
    handleNewMessage(message);
  });

  // send a message
  return (msg) => {
    //console.log(`Sending message: "${msg}"`);
    socket.emit('chatmessage', msg);
    return true;
  };
};

export const useChatService = (onMessage, id) => {
  // The chat messagesstate holder
  const { loading, socket, user, notifications, setNotifications } = useContext(
    UserContext
  );
  const [messages, setChatMessages] = useState([]);

  // The emitter holder
  const [sendMessage, setEmitter] = useState(() => {
    //console.log('Server not connected');
    return false;
  });

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
        (newMsg) => {
          const msgobj = {
            type: String(newMsg.user) === String(user._id) ? 'me' : 'server',
            text: newMsg.text,
          };
          // IMPORTANT: use a function, as setChatMessages can be stale
          setChatMessages((currentState) => [msgobj, ...currentState]);
          //setChatMessages([...messages, msgobj]);
          onMessage(newMsg);
        },
        id,
        socket,
        notifications,
        setNotifications
      );

      // NOTE: https://github.com/facebook/react/issues/14087
      // This is sendMessages
      setEmitter(() => (msg) => {
        // Emit websocket message
        emitter(msg);
        // Add to messages array
        const msgobj = { type: 'me', text: msg };
        setChatMessages((currentState) => [msgobj, ...currentState]);
        onMessage(msgobj);
      });
    }
    return (
      user.type &&
      (() => {
        if (socket) {
          //console.log('executing reconnect');
          socket.emit('adminUserConnecting', user);
        }
      })
    );
  }, []);

  return {
    messages,
    sendMessage,
  };
};
