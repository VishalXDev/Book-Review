const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllUsers); // Admin-only route

module.exports = router;
