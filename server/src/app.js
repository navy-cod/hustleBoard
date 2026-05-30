const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const jobsRoutes = require('./routes/jobs.routes');
const categoriesRoutes = require('./routes/categories.routes');

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

//Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString()    });
});

//Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app; 