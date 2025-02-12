const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat', {});

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    image: String,
    video: String, // Added to store video as base64 string
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
