import React, { useState, useEffect } from 'react';
import { Loading } from './loading.js';
import { UserContext, getUserLogged } from './auth.api.js';
import { SocketConnection } from './socketConnection.js';
import { notification } from 'antd';

// THIS is a HOC
export const withUser = (Content) => () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState();
  const [notifications, setNotifications] = useState({ active: false });

  useEffect(() => {
    //console.log('loading user...');
    getUserLogged()
      .then((user) => {
        //console.log(`Welcome ${user.username}`);
        setUser(user);
        const userSocket = SocketConnection(
          setNotifications,
          user,
          notification
        );
        setSocket(userSocket);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        socket,
        setSocket,
        notifications,
        setNotifications,
      }}
    >
      {loading && <Loading />}
      <Content />
    </UserContext.Provider>
  );
};
