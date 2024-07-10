const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost/chat', {  });

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    image: String, 
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', async (socket) => {
    let nickname = "anonymous";

    // Handle the nickname event to set the user's nickname
    socket.on('nickname', (data) => {
        nickname = data;
        socket.broadcast.emit('welcome', `${nickname} joined the chat`);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('bye', `${nickname} left the chat`);
    });

    // Send existing messages to the client
    try {
        const messages = await Message.find().sort({ timestamp: 1 }).exec();
        socket.emit('init', messages);
    } catch (err) {
        console.error(err);
    }

    // Handle new message from the client
    socket.on('message', async (data) => {
        const newMessage = new Message({
            user: data.user,
            message: data.message || '',
            image: data.image || ''
        });
        try {
            await newMessage.save();
            io.emit('message', data);
        } catch (err) {
            console.error(err);
        }
    });

    // Handle typing events
    socket.on('typing', () => {
        socket.broadcast.emit('typing', nickname);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
