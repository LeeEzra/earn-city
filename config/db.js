require('dotenv').config();
const { Pool } = require('pg');
const isLocal = process.env.NODE_ENV === 'local';
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: !isLocal ? {
        rejectUnauthorized: false,
      }
    : false,
});
module.exports = pool;
