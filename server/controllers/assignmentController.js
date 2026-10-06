const { getStore } = require('../config/db');

const getAssignments = (req, res, next) => {
  try {
    const { className, subject } = req.query;
    const store = getStore();

    let assignments = store.assignments;
    if (className) assignments = assignments.filter(a => a.className === className);
    if (subject) assignments = assignments.filter(a => a.subject === subject);

    res.json({ success: true, count: assignments.length, assignments });
  } catch (error) {
    next(error);
  }
};

const submitAssignment = (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { submissionText } = req.body;
    const studentId = req.user.id;
    const studentName = req.user.name;
    const store = getStore();

    const assignment = store.assignments.find(a => a.id === assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const existingIndex = store.submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);
    const newSubmission = {
      id: existingIndex >= 0 ? store.submissions[existingIndex].id : `sub_${Date.now()}`,
      assignmentId,
      studentId,
      studentName,
      submissionText,
      submittedAt: new Date().toISOString(),
      marksGiven: null,
      feedback: null,
      status: 'Submitted'
    };

    if (existingIndex >= 0) {
      store.submissions[existingIndex] = newSubmission;
    } else {
      store.submissions.push(newSubmission);
    }

    res.json({ success: true, message: 'Assignment submitted successfully!', submission: newSubmission });
  } catch (error) {
    next(error);
  }
};

const getStudentSubmissions = (req, res, next) => {
  try {
    const studentId = req.user.id;
    const store = getStore();

    const submissions = store.submissions.filter(s => s.studentId === studentId);
    res.json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    next(error);
  }
};

const createAssignment = (req, res, next) => {
  try {
    const { title, subject, className, chapterId, dueDate, maxMarks = 20, instructions } = req.body;
    const store = getStore();

    const newAssignment = {
      id: `asg_${Date.now()}`,
      title,
      subject,
      className,
      chapterId: chapterId || 'ch_sci_c7_01',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks,
      instructions
    };

    store.assignments.push(newAssignment);
    res.status(201).json({ success: true, message: 'Assignment created successfully!', assignment: newAssignment });
  } catch (error) {
    next(error);
  }
};

const gradeSubmission = (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { marksGiven, feedback } = req.body;
    const store = getStore();

    const submission = store.submissions.find(s => s.id === submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    submission.marksGiven = Number(marksGiven);
    submission.feedback = feedback;
    submission.status = 'Graded';

    res.json({ success: true, message: 'Submission graded successfully!', submission });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  submitAssignment,
  getStudentSubmissions,
  createAssignment,
  gradeSubmission
};
