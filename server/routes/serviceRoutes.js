const express = require('express');
const router = express.Router();
const { getServices, createService } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getServices);
router.post('/', protect, admin, createService);

module.exports = router;