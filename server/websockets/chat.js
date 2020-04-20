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

    socket.on('auth', async (user, id) => {
      socket.user = user;
      existingRoom = await Chat.findOne({
        company: user.company,
        roomName: id,
      });
      console.log('after looking room', existingRoom);
      socket.room = existingRoom
        ? existingRoom
        : await Chat.create({ company: user.company, roomName: id });
      socket.join(socket.room.roomName);
      socket.emit(
        'chatHistory',
        socket.room.messages.length > 0
          ? socket.room.messages
          : [{ text: `Welcome ${user.name.first}` }]
      );
      console.log(socket.user, socket.room);
    });

    // Register event listener on messages
    socket.on('chatmessage', async (msg) => {
      const room = await Chat.findById(socket.room._id);
      room.messages = [...room.messages, { user: socket.user._id, text: msg }];
      await room.save();
      socket
        .to(socket.room.roomName)
        .emit('chatmessage', { user: socket.user._id, text: msg });
    });
  });
};
