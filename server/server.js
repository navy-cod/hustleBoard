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
