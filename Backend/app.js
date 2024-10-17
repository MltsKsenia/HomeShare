//app.js
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');


app.use(express.json());

app.use('/users', userRoutes);
app.use('/items', itemRoutes);

module.exports = app;