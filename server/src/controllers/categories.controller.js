const pool = require('../db/pool');

//Get all jobs
const listCategories = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, slug FROM categories ORDER BY ASC'
        );

        return res.status(200).json({ categories: result.rows });
    } catch (err) {
        console.error('listCategories error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { listCategories };