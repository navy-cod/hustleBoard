const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
    skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit ({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many accounts created from this network. Please try again later.' },
});

const generalLimiter = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down.' },
});

module.exports = { loginLimiter, registerLimiter, generalLimiter };