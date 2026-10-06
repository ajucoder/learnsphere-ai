const express = require('express');
const router = express.Router();
const { getAdminAnalytics, getAllUsers, deleteUser } = require('../controllers/adminController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/analytics', authenticateToken, authorize(ROLES.ADMIN), getAdminAnalytics);
router.get('/users', authenticateToken, authorize(ROLES.ADMIN), getAllUsers);
router.delete('/users/:userId', authenticateToken, authorize(ROLES.ADMIN), deleteUser);

module.exports = router;
