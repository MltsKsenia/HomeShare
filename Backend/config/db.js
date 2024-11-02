// db.js
const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

// Log database connection status
db.raw('SELECT 1')
    .then(() => console.log(`Database connection successful in ${environment} mode`))
    .catch(err => {
        console.error(`Database connection failed in ${environment} mode:`, err);
        process.exit(1); // Exit the process if the connection fails
    });

module.exports = db;