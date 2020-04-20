import io from 'socket.io-client';

export const SocketConnection = (handleNotification, user) => {
  console.log('Connecting websocket...');
  const socket = io(process.env.BACK_URL);

  socket.emit('userType', user);

  socket.on('notification', (notification) => {
    console.log(notification);
    /*notifications.map((notification) => {
      handleNotification(notification);
    });*/
  });

  return socket;
};
