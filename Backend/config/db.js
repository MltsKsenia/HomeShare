// db.js
const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);
console.log(db);

module.exports = db;