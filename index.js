const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('User connected');
  
  let nickname = 'Anonymous';

  socket.on('set nickname', (name) => {
    nickname = name;
    socket.broadcast.emit('chat message', `${nickname} connected`);
    console.log(`${nickname} connected`);
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', `${nickname}: ${msg}`);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', nickname);
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    io.emit('chat message', `${nickname} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
