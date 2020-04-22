const socketio = require('socket.io');
const Chat = require('../models/Chat');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');
const _ = require('lodash');

module.exports = (server) => {
  const io = socketio(server);
  console.log('Configured websockets');

  io.on('connection', (socket) => {
    console.log('a user connected');

    // Connect the users to the socket, admin users are joined to a room that always read notifications
    socket.on('userType', async (user) => {
      socket.user = user;
      if (user.type) {
        console.log('connecting to company room');
        socket.join(socket.user.company);
        const existingRoom = await Chat.findOne({
          company: socket.user.company,
          roomName: socket.user.company,
        });
        const room = existingRoom
          ? existingRoom
          : await Chat.create({
              company: socket.user.company,
              roomName: socket.user.company,
            });
      } else {
        const existingRoom = await Chat.findOne({
          company: socket.user.company,
          roomName: socket.user._id,
        });
        socket.room = existingRoom
          ? existingRoom
          : await Chat.create({
              company: socket.user.company,
              roomName: socket.user._id,
            });
        socket.join(socket.room.roomName);
      }
    });

    socket.on('end', async (user) => {
      console.log('disconnecting');
      socket.disconnect();
    });

    socket.on('adminUserConnecting', (user) => {
      socket.user = user;
      console.log('reconnecting');
      if (user.type) {
        socket.join(socket.user.company);
      }
    });

    socket.on('retrieveNotifications', async (user) => {
      console.log('retrieving notific');
      if (user.type) {
        existingRoom = await Chat.findOne({
          company: user.company,
          roomName: user.company,
        });
      } else {
        existingRoom = await Chat.findOne({
          company: user.company,
          roomName: user._id,
        });
      }
      existingRoom &&
        socket.emit(
          'notification',
          existingRoom.notifications.slice(-3),
          existingRoom._id
        );
    });

    socket.on(
      'updateNotification',
      async ({ user, incomingNotification, room }) => {
        console.log('updating notific');
        const existingRoom = await Chat.findById(room);
        const readNotification = _.find(
          existingRoom.notifications,
          (roomNotification) =>
            String(roomNotification._id) === String(incomingNotification._id)
        );
        if (readNotification) {
          readNotification.readBy = [
            ...readNotification.readBy,
            socket.user._id,
          ];
          await existingRoom.save();
        }
      }
    );

    //connect the admin to the room of specific user && recover history messages
    socket.on('auth', async (id) => {
      console.log('user entering chatroom');
      if (socket.user.type) {
        socket.leave(socket.user.company);
        existingRoom = await Chat.findOne({
          company: socket.user.company,
          roomName: id,
        });
        socket.room = existingRoom
          ? existingRoom
          : await Chat.create({ company: socket.user.company, roomName: id });
        socket.join(socket.room.roomName);
      }
      socket.emit(
        'chatHistory',
        socket.room.messages.length > 0
          ? socket.room.messages
          : [{ text: `Welcome ${socket.user.name.first}` }]
      );
    });

    // Register event listener on messages
    socket.on('chatmessage', async (msg) => {
      const room = await Chat.findById(socket.room._id);
      const globalRoom = await Chat.findOne({
        company: socket.user.company,
        roomName: socket.user.company,
      });

      room.messages = [...room.messages, { user: socket.user._id, text: msg }];
      room.messages.length > 50 &&
        (room.messages = [...room.messages].slice(-50));
      room.notifications = [
        ...room.notifications,
        { sentBy: socket.user._id, readBy: [socket.user._id] },
      ];
      room.notifications.length > 10 &&
        (room.notifications = [...room.notifications].slice(-10));
      await room.save();

      globalRoom.notifications = [
        ...globalRoom.notifications,
        { sentBy: socket.user._id, readBy: [socket.user._id] },
      ];
      globalRoom.notifications.length > 10 &&
        (globalRoom.notifications = [...globalRoom.notifications].slice(-10));
      await globalRoom.save();

      socket
        .to(socket.room.roomName)
        .emit('chatmessage', { user: socket.user._id, text: msg });

      // send only last notification

      if (!socket.user.type) {
        socket
          .to(socket.user.company)
          .emit('newNotification', socket.user.name);
      }
    });
  });
};
