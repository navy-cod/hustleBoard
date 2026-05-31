const { Router } = require('express');
const { listCategories } = require('../controllers/categories.controller');

const router = Router();

//public
router.get('/', listCategories);

module.exports = router;
