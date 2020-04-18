const socketio = require('socket.io');

module.exports = (server) => {
  const io = socketio(server);
  console.log('Configured websockets');

  io.on('connection', (socket) => {
    console.log('a user connected');
    // Emit the first message on connect
    socket.emit('chatmessage', 'Hola desde el servidor');

    // Register event listener on messages
    socket.on('chatmessage', (msg) => {
      console.log(`Received message: "${msg}", replying....`);
      socket.broadcast.emit('chatmessage', 'Reply: ' + msg);
    });
  });
};
