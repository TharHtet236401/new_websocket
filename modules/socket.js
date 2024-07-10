// modules/socket.js
const socketIo = require('socket.io');
const Message = require('../db/db');

function initSocket(server) {
    const io = socketIo(server);

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
}

module.exports = initSocket;
