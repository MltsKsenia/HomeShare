//app.js
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// API routes
app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api', reservationRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')));

// This handles any requests that don't match the ones above, returning the React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'Frontend', 'dist', 'index.html'));
});

module.exports = app;