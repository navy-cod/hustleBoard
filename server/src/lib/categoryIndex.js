const pool = require('../db/pool');

let categoryIndex = {};
let lastBuiltAt   = null;

const buildCategoryIndex = async () => {
  // Fetch all categories
  const catResult = await pool.query(
    'SELECT id, name, slug FROM categories ORDER BY name ASC'
  );

  // Fetch all open jobs with their category_id
  const jobResult = await pool.query(
    `SELECT j.id, j.title, j.type, j.location, j.created_at,
            j.category_id, u.full_name AS employer_name
     FROM jobs j
     JOIN users u ON j.employer_id = u.id
     WHERE j.status = 'open'`
  );

  // Initialise the hash map — one key per category slug
  const index = {};
  for (const cat of catResult.rows) {
    index[cat.slug] = {
      id:   cat.id,
      name: cat.name,
      slug: cat.slug,
      jobs: [],          // will be populated in the next loop
    };
  }

  const idToSlug = {};
  for (const cat of catResult.rows) {
    idToSlug[cat.id] = cat.slug;
  }

  for (const job of jobResult.rows) {
    const slug = idToSlug[job.category_id];
    if (slug && index[slug]) {
      index[slug].jobs.push(job);
    }
  }

  categoryIndex = index;
  lastBuiltAt   = new Date();

  console.log(
    `Category index built — ${catResult.rows.length} categories, ` +
    `${jobResult.rows.length} jobs indexed`
  );

  return index;
};

// O(1) lookup by slug
const getBySlug = (slug) => categoryIndex[slug] ?? null;

// Returns all categories with their job counts 
const getSummary = () =>
  Object.values(categoryIndex).map(({ id, name, slug, jobs }) => ({
    id,
    name,
    slug,
    job_count: jobs.length,
  }));

const getLastBuiltAt = () => lastBuiltAt;

module.exports = { buildCategoryIndex, getBySlug, getSummary, getLastBuiltAt };
