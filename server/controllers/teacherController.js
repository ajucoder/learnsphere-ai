const { getStore } = require('../config/db');
const { generateQuizQuestions } = require('../services/aiService');

const getTeacherAnalytics = (req, res, next) => {
  try {
    const store = getStore();
    const students = store.users.filter(u => u.role === 'student');
    const totalQuizzes = store.quizzes.length;
    const totalAssignments = store.assignments.length;
    const pendingSubmissions = store.submissions.filter(s => s.status === 'Submitted').length;

    res.json({
      success: true,
      analytics: {
        totalStudents: students.length,
        totalQuizzes,
        totalAssignments,
        pendingSubmissions,
        classDistribution: [
          { name: 'Class 6', count: 12 },
          { name: 'Class 7', count: 18 },
          { name: 'Class 8', count: 15 }
        ],
        subjectPerformance: [
          { subject: 'Science', avgScore: 84 },
          { subject: 'Mathematics', avgScore: 78 },
          { subject: 'Social Science', avgScore: 88 },
          { subject: 'English', avgScore: 91 }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

const aiGenerateQuiz = async (req, res, next) => {
  try {
    const { topic, numQuestions = 3, difficulty = 'Medium', className = 'Class 7' } = req.body;

    const questions = await generateQuizQuestions({ topic, numQuestions, difficulty, className });

    res.json({
      success: true,
      message: `AI generated ${questions.length} quiz questions for ${topic}`,
      questions
    });
  } catch (error) {
    next(error);
  }
};

const getStudentList = (req, res, next) => {
  try {
    const store = getStore();
    const students = store.users
      .filter(u => u.role === 'student')
      .map(s => {
        const progress = store.progresses.find(p => p.studentId === s.id) || { xp: 0, streakDays: 0, badges: [] };
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          className: s.className,
          xp: progress.xp,
          streakDays: progress.streakDays,
          badgesCount: progress.badges.length
        };
      });

    res.json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeacherAnalytics,
  aiGenerateQuiz,
  getStudentList
};
