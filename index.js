const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const initSocket = require('./modules/socket');
const routes = require('./modules/routes');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

initSocket(server);

app.use('/', routes);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
