//app.js
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api', reservationRoutes);

app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'dist', 'index.html'));
});

module.exports = app;