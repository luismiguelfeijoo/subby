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
    // Emit the first message on connect
    socket.on('userType', async (user) => {
      socket.user = user;
      if (user.type) {
        console.log('connecting to company room');
        socket.join(socket.user.company);
      }
    });

    socket.on('auth', async (id) => {
      console.log('user entering chatroom');
      existingRoom = await Chat.findOne({
        company: socket.user.company,
        roomName: id,
      });
      console.log(socket.user);
      socket.room = existingRoom
        ? existingRoom
        : await Chat.create({ company: socket.user.company, roomName: id });
      socket.join(socket.room.roomName);
      console.log(socket.room);
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
      room.messages = [...room.messages, { user: socket.user._id, text: msg }];
      await room.save();
      socket
        .to(socket.room.roomName)
        .emit('chatmessage', { user: socket.user._id, text: msg });
      socket
        .to(socket.user.company)
        .emit('notification', `${socket.user.name.first} sent ${msg}`);
    });
  });
};
