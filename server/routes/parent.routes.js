const express = require('express');
const router = express.Router();
const { getParentOverview } = require('../controllers/parentController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/overview', authenticateToken, authorize(ROLES.PARENT, ROLES.ADMIN), getParentOverview);

module.exports = router;
