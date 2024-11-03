//app.js
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// API routes
app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api', reservationRoutes);

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, '..', 'Frontend', 'dist')));

// This handles any requests that don't match the ones above, returning the React app
app.get('*', (req, res) => {
    console.log(`Request URL: ${req.url}`);
    res.sendFile(path.resolve(__dirname, '..', 'Frontend', 'dist', 'index.html'));
});

module.exports = app;