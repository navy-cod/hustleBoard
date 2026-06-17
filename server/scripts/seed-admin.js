require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/db/pool');

const run = async () => {
    const [, , email, password, fullName] = process.argv;

    if (!email || !password || !fullName) {
        console.error('Usage: node scripts/seed-admin.js <email> <password> <full_name>');
        process.exit(1);
    }

    if (password.length < 8) {
        console.error('Password must be at least 8 characters.');
        process.exit(1);
    }

    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        if (existing.rows[0]) {
            console.error(`A user with email ${email} already exists.`);
            process.exit(1);
        }

        const password_hash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, role)
            VALUES ($1, $2, $3, 'admin')
            RETURNING id, email, full_name, role`,
            [email.toLowerCase().trim(), password_hash, fullName.trim()]
        );

        console.log('Admin user created:');
        console.log(result.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Failed to create admin:', err.message);
        process.exit(1);
    }
};

run();