import io from 'socket.io-client';

export const SocketConnection = (setNotifications, user, notification) => {
  console.log('Connecting websocket...');
  const socket = io(process.env.BACK_URL);

  socket.emit('userType', user);

  socket.emit('retrieveNotifications', user);

  socket.on('notification', (notifications, room) => {
    notifications.map((incomingNotification) => {
      if (String(incomingNotification.sentBy) !== String(user._id)) {
        const check = incomingNotification.readBy
          .map((userThatRead) => String(userThatRead) !== String(user._id))
          .includes(false);
        if (!check) {
          setNotifications({
            active: true,
            data: { user, incomingNotification, room },
          });
          //socket.emit('readNotification', { user, notification, room });
        }
      }
    });
  });

  socket.on('newNotification', (name) => {
    console.log('setting new notification');
    notification.open({
      message: 'New message',
      description: `${name.first} wrote you a new message`,
      duration: 3,
    });
  });

  return socket;
};
