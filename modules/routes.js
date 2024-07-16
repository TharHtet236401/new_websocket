// modules/routes.js
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/post', (req, res) => {
    res.send('This is the /post route');
});

module.exports = router;
