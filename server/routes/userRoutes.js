const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.get('/profile', protect, getUserProfile);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;