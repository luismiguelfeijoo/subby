import io from 'socket.io-client';

export const SocketConnection = (setNotifications, user) => {
  console.log('Connecting websocket...');
  const socket = io(process.env.BACK_URL);

  socket.emit('userType', user);

  socket.emit('retrieveNotifications', user);

  socket.on('notification', (notifications, room) => {
    console.log(notifications);

    notifications.map((notification) => {
      if (String(notification.sentBy) !== String(user._id)) {
        const check = notification.readBy
          .map((userThatRead) => String(userThatRead) !== String(user._id))
          .includes(false);
        if (!check) {
          setNotifications({
            active: true,
            data: { user, notification, room },
          });
          //socket.emit('readNotification', { user, notification, room });
        }
      }
    });
  });

  return socket;
};
