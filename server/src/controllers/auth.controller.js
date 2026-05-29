const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const signToken = (userID, role) => 
    jwt.sign(
        { id: userID, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

const sanitizeUser = ({password_hash, ...user}) => user;


//Register controller
const register = async (req, res) => {
    const {email, password, full_name, role} = req.body;

    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase().trim()]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: 'An account with this email already exists'
            });
        }
        const password_hash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role, created_at',
            [email.toLowerCase().trim(), password_hash, full_name.trim(), role]
        );

        const user = result.rows[0];
        const token = signToken(user.id, user.role);

        return res.status(201).json({ token, user});

    }   catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//Login controller
const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase().trim()]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = signToken(user.id, user.role);

        return res.json({ token, user: sanitizeUser(user) });

    }catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//Get current user controller
const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('GetMe error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    getMe,
};