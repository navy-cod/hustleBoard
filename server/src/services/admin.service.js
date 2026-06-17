const pool = require('../db/pool');

//Users
const listUsers = async () => {
    const result = await pool.query(
        `SELECT id, email, full_name, role, is_active, created_at
        FROM users
        ORDER BY created_at DESC`
    );
    return result.rows;
};

const setUserStatus = async ({ userId, isActive, requestingAdminId }) => {
    if (userId === requestingAdminId) {
        const err = new Error('You cannot change your own account status');
        err.status = 400;
        throw err;
    }

    const result = await pool.query(
        `UPDATE users
        SET is_active = $1
        WHERE id = $2
        RETURNING id, email, full_name, role, is_active`,
        [isActive, userId]
    );

    if (!result.rows[0]) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    return result.rows[0];
};

//Jobs
const listAllJobs = async () => {
    const result = await pool.query(
        `SELECT
        j.id, j.title, j.status, j.type, j.created_at,
        c.name AS category_name,
        u.full_name AS employer_name,
        u.email AS employer_email
        FROM jobs j
        JOIN categories c ON j.category_id = c.id
        JOIN users u ON j.employer_id = u.id
        ORDER BY j.created_at DESC`
    );
    return result.rows;
};

const deleteJobAsAdmin = async (jobId) => {
    const result = await pool.query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [jobId]);
    if (!result.rows[0]) {
        const err = new Error('Job not found');
        err.status = 404;
        throw err;
    }
};

//Stats
const getStats = async () => {
    const [users, jobs, openJobs, applications] = await Promise.all([
        pool.query(`SELECT COUNT(*) FROM users`),
        pool.query(`SELECT COUNT(*) FROM jobs`),
        pool.query("SELECT COUNT(*) FROM jobs WHERE status = 'open'"),
        pool.query(`SELECT COUNT(*) FROM applications`),
    ]);

    return {
        total_users: Number(users.rows[0].count),
        total_jobs: Number(jobs.rows[0].count),
        open_jobs: Number(openJobs.rows[0].count),
        total_applications: Number(applications.rows[0].count),
    };
};

module.exports = { listUsers, setUserStatus, listAllJobs, deleteJobAsAdmin, getStats };