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
        console.log(socket.user);
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

    //connect the admin to the room of specific user && recover history messages
    socket.on('auth', async (id) => {
      console.log('user entering chatroom');
      if (socket.user.type) {
        existingRoom = await Chat.findOne({
          company: socket.user.company,
          roomName: id,
        });
        console.log(socket.user);
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
      room.notifications = [
        ...room.notifications,
        { sentBy: socket.user._id, readBy: [socket.user._id] },
      ];
      await room.save();

      globalRoom.notifications = [
        ...globalRoom.notifications,
        { sentBy: socket.user._id, readBy: [socket.user._id] },
      ];
      await globalRoom.save();

      socket
        .to(socket.room.roomName)
        .emit('chatmessage', { user: socket.user._id, text: msg });

      // send only last notification
      socket
        .to(socket.room.roomName)
        .emit('notification', room.notifications.slice(-3), room._id);
      socket
        .to(socket.user.company)
        .emit(
          'notification',
          globalRoom.notifications.slice(-3),
          globalRoom._id
        );

      socket.on('readNotification', async ({ user, notification, room }) => {
        console.log('updating notific');
        const existingRoom = await Chat.findById(room);
        const readNotification = _.find(
          existingRoom.notifications,
          (roomNotification) =>
            String(roomNotification._id) === String(notification._id)
        );
        if (readNotification) {
          readNotification.readBy = [
            ...readNotification.readBy,
            socket.user._id,
          ];
        }
      });

      socket.on('retrieveNotifications', async (user) => {
        console.log('retrieving notific');
        if (user.type) {
          existingRoom = Chat.findOne({
            company: user.company,
            roomName: user.company,
          });
        } else {
          existingRoom = Chat.findOne({
            company: user.company,
            roomName: user._id,
          });
          console.log(existingRoom);
          existingRoom &&
            socket.emit('notification', existingRoom.notifications.slice(-3));
        }
      });
    });
  });
};
