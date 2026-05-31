const { Router } = require('express');
const { body } = require('express-validator');
const { applyToJob, getMyApplications } = require('../controllers/applications.controller');
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
    applyToJob
);

router.get('/mine',
    authenticate,
    authorize('student'),
    getMyApplications
);

module.exports = router;
