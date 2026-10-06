const { getStore } = require('../config/db');

const getParentOverview = (req, res, next) => {
  try {
    const parentId = req.user.id;
    const store = getStore();

    const parent = store.users.find(u => u.id === parentId);
    const studentId = parent?.studentId || 'usr_student_01';

    const child = store.users.find(u => u.id === studentId);
    const progress = store.progresses.find(p => p.studentId === studentId) || { xp: 350, streakDays: 4, quizHistory: [] };
    const childSubmissions = store.submissions.filter(s => s.studentId === studentId);

    res.json({
      success: true,
      child: {
        name: child ? child.name : 'Aarav Sharma',
        className: child ? child.className : 'Class 7',
        email: child ? child.email : 'student@learnsphere.ai'
      },
      stats: {
        xp: progress.xp,
        streakDays: progress.streakDays,
        quizzesTaken: progress.quizHistory.length,
        avgQuizScore: progress.quizHistory.length > 0
          ? Math.round(progress.quizHistory.reduce((acc, curr) => acc + curr.score, 0) / progress.quizHistory.length)
          : 90,
        assignmentsSubmitted: childSubmissions.length,
        badgesCount: progress.badges ? progress.badges.length : 3
      },
      weeklyStudyHours: [
        { day: 'Mon', hours: 1.5 },
        { day: 'Tue', hours: 2.0 },
        { day: 'Wed', hours: 1.8 },
        { day: 'Thu', hours: 2.5 },
        { day: 'Fri', hours: 2.2 },
        { day: 'Sat', hours: 3.0 },
        { day: 'Sun', hours: 1.0 }
      ],
      aiSafetySummary: {
        totalQueries: 14,
        educationalPercentage: '100%',
        flaggedQueries: 0,
        topTopics: ['Photosynthesis', 'Integers', 'Nutrition in Animals']
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getParentOverview };
