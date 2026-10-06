const express = require('express');
const router = express.Router();
const { getQuizById, getQuizzesByChapter, submitQuiz, createQuiz } = require('../controllers/quizController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/by-chapter', authenticateToken, getQuizzesByChapter);
router.get('/:quizId', authenticateToken, getQuizById);
router.post('/:quizId/submit', authenticateToken, authorize(ROLES.STUDENT), submitQuiz);
router.post('/', authenticateToken, authorize(ROLES.TEACHER, ROLES.ADMIN), createQuiz);

module.exports = router;
