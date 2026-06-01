//Exposes the in-memory hash map via HTTP so the frontend and Postman can inspect and use it.

const { Router } = require('express');
const { getBySlug, getSummary, getLastBuiltAt } = require('../lib/categoryIndex');

const router = Router();

router.get('/summary', (req, res) => {
    res.json({
        categories: getSummary(),
        last_built: getLastBuiltAt(),
        note: 'Served from in-memory hash map - zero DB queries',
    });
});

//Lookup by slug 
router.get('/:slug', (req, res) => {
    const category = getBySlug(req.params.slug);
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }
    res.json({
        category,
        lookup_complexity: 'O(1)',
        job_count: category.jobs.length,
    });
});

module.exports = router;