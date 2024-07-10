const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('./upload');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file && req.file.location) {
        res.status(200).json({ url: req.file.location });
    } else {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

module.exports = router;
