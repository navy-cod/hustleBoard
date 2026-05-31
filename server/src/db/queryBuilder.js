//builds a dynamic WHERE clause for the jobs search endpoint.

const buildJobsQuery = (filters) => {
    const { search, category_id, type, status = 'open', limit = 20, offset = 0 } = filters;

    const clauses = [];
    const values = [];
    let idx = 1;

    clauses.push(`j.status = $${idx++}`);
    values.push(status);

    if (search) {
        clauses.push(`(j.title ILIKE $${idx} OR j.description ILIKE $${idx})`);
        values.push(`%${search.trim()}%`);
        idx++;
    }

    //category filter
    if (category_id) {
        clauses.push(`j.category_id = $${idx++}`);
        values.push(category_id);
    }

    if (type) {
        clauses.push(`j.type = $${idx++}`);
        values.push(type);
    }

    const where = clauses.length > 0
        ? 'WHERE ' + clauses.join(' AND ')
        : '';

    const query = `
        SELECT
            j.id,
            j.title,
            j.location,
            j.type,
            j.status,
            j.created_at,
            c.name AS category_name,
            c.slug AS category_slug,
            u.full_name AS employer_name
        FROM jobs j
        JOIN categories c ON j.category_id = c.id
        JOIN users u ON j.employer_id = u.id
        ${where}
        ORDER BY j.created_at DESC
        LIMIT $${idx++}
        OFFSET $${idx}
    `;

    values.push(Number(limit));
    values.push(Number(offset));

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM jobs j
        JOIN categories c ON j.category_id = c.id
        JOIN users u ON j.employer_id = u.id
        ${where}
    `;

    const countValues = values.slice(0, values.length - 2); //countValues excludes the LIMIT and OFFSET values

    return { query, values, countQuery, countValues };
};

module.exports = { buildJobsQuery };
