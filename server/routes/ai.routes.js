const express = require('express');
const router = express.Router();
const { askTutor, createAIQuiz } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');
const aiSafetyFilter = require('../middleware/aiSafety');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/tutor', authenticateToken, aiLimiter, aiSafetyFilter, askTutor);
router.post('/generate-quiz', authenticateToken, aiLimiter, aiSafetyFilter, createAIQuiz);

module.exports = router;
