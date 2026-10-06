const express = require('express');
const router = express.Router();
const {
  getAssignments,
  submitAssignment,
  getStudentSubmissions,
  createAssignment,
  gradeSubmission
} = require('../controllers/assignmentController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

router.get('/', authenticateToken, getAssignments);
router.get('/my-submissions', authenticateToken, authorize(ROLES.STUDENT), getStudentSubmissions);
router.post('/:assignmentId/submit', authenticateToken, authorize(ROLES.STUDENT), submitAssignment);
router.post('/', authenticateToken, authorize(ROLES.TEACHER, ROLES.ADMIN), createAssignment);
router.put('/submissions/:submissionId/grade', authenticateToken, authorize(ROLES.TEACHER, ROLES.ADMIN), gradeSubmission);

module.exports = router;
