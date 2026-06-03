const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./src/app');
const pool = require('./src/db/pool');
const { buildCategoryIndex } = require('./src/lib/categoryIndex');

const PORT = process.env.PORT || 3000;

const dbConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL.replace(/:[^:@\/\s]+@/g, ':****@') }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
    };
const { Client } = require('pg');
let parsedParams = {};
if (process.env.DATABASE_URL) {
    try {
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        parsedParams = {
            host: client.connectionParameters.host,
            port: client.connectionParameters.port,
            database: client.connectionParameters.database,
            user: client.connectionParameters.user,
        };
    } catch (e) {
        parsedParams = { error: e.message };
    }
}
console.log('Database connection configuration (masked):', JSON.stringify(dbConfig, null, 2));
console.log('Parsed pg connection parameters:', JSON.stringify(parsedParams, null, 2));

pool.query('SELECT NOW()')
    .then(async () => {
        console.log('Database connection established');
        await buildCategoryIndex();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err.message);
        process.exit(1);
    });
