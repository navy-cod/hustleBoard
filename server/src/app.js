const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const jobsRoutes = require('./routes/jobs.routes');
const categoriesRoutes = require('./routes/categories.routes');
const applicationsRoutes = require('./routes/applications.routes');
const categoryIndexRoutes = require('./routes/categoryIndex.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL]
    : ["http://localhost:5173"];

app.use(cors({
    origin: ( origin, callback ) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('CORS policy: origin ${origin} not allowed') );
        },
        credentials: true,
}));

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/applications', applicationsRoutes);
app.use('/api/v1/category-index', categoryIndexRoutes);
app.use('/api/v1/admin', adminRoutes);

//Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString()    });
});

//Production error handler - never expose stack traces
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : err.message,
    });
});

module.exports = app; 