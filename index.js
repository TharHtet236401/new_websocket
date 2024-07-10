const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const initSocket = require('./modules/socket');
const routes = require('./modules/routes');
const path = require('path');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Socket.IO
initSocket(server);

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
