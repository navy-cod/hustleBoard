const { Router } = require('express');
const { body, param } = require('express-validator');
const {
    getUsers, updateUserStatus, getJobs, deleteJob, getStats,
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);

router.get('/users', getUsers);
router.get('/users/:id/status',
    [
        param('id').isUUID(),
        body('is_active').isBoolean().withMessage('is_active must be true or false'),
    ],
    validate,
    updateUserStatus
);

router.get('/jobs', getJobs);
router.delete('/jobs/:id',
    [param('id').isUUID()],
    validate,
    deleteJob
);

module.exports = router;