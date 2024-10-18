//app.js
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const reservationRoutes = require('./routes/reservationRoutes');


app.use(express.json());

app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/reservations', reservationRoutes);

module.exports = app;