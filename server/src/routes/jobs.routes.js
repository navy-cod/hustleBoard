const { Router } = require('express');
const { body, query, param } = require('express-validator');
const { listJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

//Validation rules sets
const listJobsRules = [
    query( 'limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be 0 or greater'),
    query('type')
        .optional()
        .isIn(['internship', 'part-time', 'freelance', 'full-time'])
        .withMessage('Invalid job type'),
];

const jobIdRules = [
    param('id')
        .isUUID()
        .withMessage('Job ID must be a valid UUID'),
];

const createJobRules = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters long'),
    body('description')
        .trim()
        .isLength({ min: 20 })
        .withMessage('Description must be at least 20 characters long'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required'),
    body('type')
        .isIn(['internship', 'part-time', 'freelance', 'full-time'])
        .withMessage('Invalid job type'),
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('A valid category_id is required'),
    body('status')
        .optional()
        .isIn(['open', 'closed', 'draft'])
        .withMessage('Invalid status'),
];

const updateJobRules = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters long'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 20 })
        .withMessage('Description must be at least 20 characters long'),
    body('type')
        .optional()
        .isIn(['internship', 'part-time', 'freelance', 'full-time'])
        .withMessage('Invalid job type'),
    body('status')
        .optional()
        .isIn(['open', 'closed', 'draft'])
        .withMessage('Invalid status'),
];

//Route definitions
    //public
router.get('/', listJobsRules, validate, listJobs);
router.get('/:id', jobIdRules, validate, getJob);
    //Employer only
router.post('/', 
    authenticate, 
    authorize('employer', 'admin'),
    createJobRules, 
    validate, 
    createJob
);
    //Owner or admin only
router.patch('/:id', 
    authenticate, 
    authorize('owner', 'admin'),
    jobIdRules,
    validate, 
    updateJob
);
router.delete('/:id', 
    authenticate, 
    authorize('owner', 'admin'), 
    jobIdRules, 
    validate, 
    deleteJob
);

module.exports = router;
