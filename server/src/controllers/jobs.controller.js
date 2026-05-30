const pool = require('../db/pool');
const { buildJobsQuery } = require('../db/queryBuilder');

//list jobs (public + with search + filter +pagination)
const listJobs = async (req, res) => {
    try {
        const { query, values, countQuery, countValues } = buildJobsQuery(req.query);

        const [jobsResult, countResult] = await Promise.all([
            pool.query(query, values),
            pool.query(countQuery, countValues),
        ]);

        const total = Number(countResult.rows[0].total);
        const limit = Number(req.query.limit) || 20;

        return res.status(200).json({
            jobs: jobsResult.rows,
            pagination: {
                total,
                limit,
                offset: Number(req.query.offset) || 0,
                pages: Math.ceil(total / limit)
            },
        });
    }catch (err) {
        console.error('listJobs error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//get single job
const getJob = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                j.*,
                c.name AS category_name,
                c.slug AS category_slug,
                u.full_name AS employer_name
            FROM jobs j
            JOIN categories c ON j.category_id = c.id
            JOIN users u ON j.employer_id = u.id
            WHERE j.id = $1`,
            [req.params.id]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('getJob error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//create job (employer only)
const createJob = async (req, res) => {
    const { title, description, location, type, category_id, status = 'open' } = req.body;

    try {
        const catCheck = await pool.query(
            'SELECT id FROM categories WHERE id = $1',
            [category_id]
        );
        if (catCheck.rowCount === 0) {
            return res.status(400).json({ message: 'Invalid category_id' });
        }

        const result = await pool.query(
            `INSERT INTO jobs (employer_id, category_id, title, description, location, type, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [req.user.id, category_id, title, description, location, type, status]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('createJob error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//update job (owner or admin)
const updateJob = async (req, res) => {
    try{
        const existing = await pool.query(
            'SELECT * FROM jobs WHERE id = $1',
            [req.params.id]
        );

        if (!existing.rows[0]) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const job = existing.rows[0];

        if (job.employer_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only edit your own listings' });
        }

        const updatedTitle = req.body.title ?? job.title;
        const updatedDescription = req.body.description ?? job.description;
        const updatedLocation = req.body.location ?? job.location;
        const updatedType = req.body.type ?? job.type;
        const updatedStatus = req.body.status ?? job.status;
        const updatedCategoryId = req.body.category_id ?? job.category_id;

        const result = await pool.query(
            `UPDATE jobs
             SET title = $1,
                 description = $2,
                 location = $3,
                 type = $4,
                 status = $5,
                 category_id = $6
            WHERE id = $7
             RETURNING *`,
            [updatedTitle, updatedDescription, updatedLocation, updatedType, updatedStatus, updatedCategoryId, req.params.id]
        );
        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('updateJob error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//delete job (owner or admin)
const deleteJob = async (req, res) => {
    try {
        const existing = await pool.query(
            'SELECT employer_id FROM jobs WHERE id = $1',
            [req.params.id]
        );

        if (!existing.rows[0]) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (existing.rows[0].employer_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only delete your own listings' });
        }

        await pool.query(
            'DELETE FROM jobs WHERE id = $1',
            [req.params.id]
        );
        return res.status(204).send(); //204 No Content - standard response for a successful DELETE
    } catch (err) {
        console.error('deleteJob error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    listJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
};