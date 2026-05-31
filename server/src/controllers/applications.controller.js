const pool = require('../db/pool');

// Apply to a job listing (student only)
const applyToJob = async (req, res) => {
    const { job_id, cover_note, resume_url } = req.body;
    const student_id = req.user.id;

    try {
        // 1. Verify user is student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can apply to jobs' });
        }

        // 2. Verify job exists and is open
        const jobCheck = await pool.query(
            'SELECT status FROM jobs WHERE id = $1',
            [job_id]
        );

        if (jobCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (jobCheck.rows[0].status !== 'open') {
            return res.status(400).json({ message: 'This job listing is closed' });
        }

        // 3. Verify student has not already applied
        const existingCheck = await pool.query(
            'SELECT id FROM applications WHERE student_id = $1 AND job_id = $2',
            [student_id, job_id]
        );

        if (existingCheck.rowCount > 0) {
            return res.status(409).json({ message: 'You have already applied to this job' });
        }

        // 4. Create the application
        const result = await pool.query(
            `INSERT INTO applications (student_id, job_id, cover_note, resume_url)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [student_id, job_id, cover_note || null, resume_url || null]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('applyToJob error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch all applications submitted by the logged-in student
const getMyApplications = async (req, res) => {
    const student_id = req.user.id;

    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can view their applications' });
        }

        const result = await pool.query(
            `SELECT 
                a.id,
                a.cover_note,
                a.resume_url,
                a.status,
                a.applied_at,
                j.title AS job_title,
                j.location,
                u.full_name AS employer_name
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             JOIN users u ON j.employer_id = u.id
             WHERE a.student_id = $1
             ORDER BY a.applied_at DESC`,
            [student_id]
        );

        return res.status(200).json({ applications: result.rows });
    } catch (err) {
        console.error('getMyApplications error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    applyToJob,
    getMyApplications,
};
