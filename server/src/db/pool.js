//This module creates a connection pool to the database and exports a single Postgresql connection pool
const { Pool } = require('pg');

//This pool constructor reads these values from environment variables.
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

//This event fires if a connection in the pool encounter an error while idle (not in the middle of a query).
//Without this handler, Node.js would crash the entire process on an unhandled error.
pool.on('error', (err) => {
    console.error( 'Unexpevted database pool error:', err.message);
    process.exit(1);
});

module.exports = pool;