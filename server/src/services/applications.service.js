const pool = require('../db/pool');

//Apply to a job 

const applyToJob = async ({ studentId, jobId, coverNote }) => {
  // Verify the job exists and is open before inserting.
  const jobCheck = await pool.query(
    "SELECT id, status FROM jobs WHERE id = $1",
    [jobId]
  );

  if (!jobCheck.rows[0]) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }

  if (jobCheck.rows[0].status !== 'open') {
    const err = new Error('This job listing is no longer accepting applications');
    err.status = 409;
    throw err;
  }

  // Attempt the INSERT. If the student has already applied, PostgreSQL
  // will throw a unique-constraint violation (error code 23505).
  try {
    const result = await pool.query(
      `INSERT INTO applications (student_id, job_id, cover_note)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [studentId, jobId, coverNote || null]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      // PostgreSQL error code 23505 = unique_violation
      const conflict = new Error('You have already applied to this job');
      conflict.status = 409;
      throw conflict;
    }
    throw err;
  }
};

// Student: get own applications 

const getMyApplications = async (studentId) => {
  const result = await pool.query(
    `SELECT
       a.id,
       a.status,
       a.cover_note,
       a.applied_at,
       j.id          AS job_id,
       j.title       AS job_title,
       j.location,
       j.type,
       u.full_name   AS employer_name
     FROM applications a
     JOIN jobs  j ON a.job_id      = j.id
     JOIN users u ON j.employer_id = u.id
     WHERE a.student_id = $1
     ORDER BY a.applied_at DESC`,
    [studentId]
  );
  return result.rows;
};

// Employer: get all applications for one of their jobs 

const getJobApplications = async ({ jobId, employerId }) => {
  // we first verify the employer actually owns this job.
  const ownerCheck = await pool.query(
    'SELECT employer_id FROM jobs WHERE id = $1',
    [jobId]
  );

  if (!ownerCheck.rows[0]) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }

  if (ownerCheck.rows[0].employer_id !== employerId) {
    const err = new Error('You do not have permission to view these applications');
    err.status = 403;
    throw err;
  }

  const result = await pool.query(
    `SELECT
       a.id,
       a.status,
       a.cover_note,
       a.applied_at,
       u.id          AS student_id,
       u.full_name   AS student_name,
       u.email       AS student_email
     FROM applications a
     JOIN users u ON a.student_id = u.id
     WHERE a.job_id = $1
     ORDER BY a.applied_at ASC`,
    [jobId]
  );

  return result.rows;
};

// Employer: update application status 

const updateApplicationStatus = async ({ applicationId, employerId, status }) => {
  // Fetch the application and verify the employer owns the associated job.
  const appCheck = await pool.query(
    `SELECT a.id, j.employer_id
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.id = $1`,
    [applicationId]
  );

  if (!appCheck.rows[0]) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }

  if (appCheck.rows[0].employer_id !== employerId) {
    const err = new Error('You do not have permission to update this application');
    err.status = 403;
    throw err;
  }

  const result = await pool.query(
    `UPDATE applications
     SET status = $1
     WHERE id   = $2
     RETURNING *`,
    [status, applicationId]
  );

  return result.rows[0];
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
