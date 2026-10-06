const express = require('express');
const router = express.Router();
const { getChapters, getChapterById, completeLesson, getStudentProgress } = require('../controllers/studentController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/chapters', authenticateToken, getChapters);
router.get('/chapters/:chapterId', authenticateToken, getChapterById);
router.post('/lesson/complete', authenticateToken, authorize(ROLES.STUDENT), completeLesson);
router.get('/progress', authenticateToken, authorize(ROLES.STUDENT), getStudentProgress);

module.exports = router;
