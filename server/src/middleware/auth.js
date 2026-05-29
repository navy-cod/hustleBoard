//Protect routes by verifying JWT tokens
const jwt = require('jsonwebtoken');
const { all } = require('../app');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user =  decoded; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };

const authorize = (...allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
            message: 'Forbidden: insufficient permissions' 
        });
    }
    next();
};

module.exports = { authenticate, authorize };