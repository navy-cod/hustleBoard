const { Router } = require('express');
const { body, param } = require('express-validator');
const { apply, getMyApplications, getJobApplications, updateStatus } = require('../controllers/applications.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

// Student routes only
router.post('/',
    authenticate,
    authorize('student'),
    [
        body('job_id')
            .isUUID()
            .withMessage('Valid Job ID is required'),
        body('cover_note')
            .optional()
            .trim(),
        body('resume_url')
            .optional()
            .trim()
            .isURL()
            .withMessage('Resume URL must be a valid URL'),
    ],
    validate,
    apply
);

router.get('/mine',
    authenticate,
    authorize('student'),
    getMyApplications
);

// Employer routes 
router.get('/job/:jobId',
    authenticate,
    authorize('employer', 'admin'),
    [param('jobId').isUUID().withMessage('Valid Job ID is required')],
    validate,
    getJobApplications
);

router.patch('/:id/status',
    authenticate,
    authorize('employer', 'admin'),
    [
        param('id').isUUID().withMessage('Valid Application ID is required'),
        body('status')
            .isIn(['reviewed', 'accepted', 'rejected'])
            .withMessage('Status must be one of: reviewed, accepted, or rejected'),
    ],
    validate,
    updateStatus
);

module.exports = router;
