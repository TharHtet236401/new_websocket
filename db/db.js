require('dotenv').config(); 
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI; 

mongoose.connect(url)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    image: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
