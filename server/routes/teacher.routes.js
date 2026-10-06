const express = require('express');
const router = express.Router();
const { getTeacherAnalytics, aiGenerateQuiz, getStudentList } = require('../controllers/teacherController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/analytics', authenticateToken, authorize(ROLES.TEACHER, ROLES.ADMIN), getTeacherAnalytics);
router.get('/students', authenticateToken, authorize(ROLES.TEACHER, ROLES.ADMIN), getStudentList);
router.post('/generate-quiz', authenticateToken, authorize(ROLES.TEACHER, ROLES.ADMIN), aiGenerateQuiz);

module.exports = router;
