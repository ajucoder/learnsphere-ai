const { getStore } = require('../config/db');

const getAdminAnalytics = (req, res, next) => {
  try {
    const store = getStore();
    const students = store.users.filter(u => u.role === 'student').length;
    const teachers = store.users.filter(u => u.role === 'teacher').length;
    const parents = store.users.filter(u => u.role === 'parent').length;
    const admins = store.users.filter(u => u.role === 'admin').length;

    res.json({
      success: true,
      metrics: {
        totalUsers: store.users.length,
        students,
        teachers,
        parents,
        admins,
        totalChapters: store.contents.length,
        totalQuizzes: store.quizzes.length,
        totalAssignments: store.assignments.length,
        aiTokenUsageToday: 42500,
        aiQueriesToday: 184,
        systemStatus: 'Optimal (Healthy)'
      },
      aiUsageTrend: [
        { date: 'Oct 01', queries: 120, tokens: 28000 },
        { date: 'Oct 02', queries: 145, tokens: 34000 },
        { date: 'Oct 03', queries: 160, tokens: 38000 },
        { date: 'Oct 04', queries: 175, tokens: 41000 },
        { date: 'Oct 05', queries: 184, tokens: 42500 }
      ],
      auditLogs: [
        { id: 1, action: 'User Register', details: 'New Student registered: Aarav Sharma', time: '10 mins ago', level: 'Info' },
        { id: 2, action: 'AI Guardrail Pass', details: 'Query filtered: Photosynthesis concept breakdown', time: '25 mins ago', level: 'Info' },
        { id: 3, action: 'Assignment Created', details: 'Teacher Priya Verma created Photosynthesis Activity', time: '1 hour ago', level: 'Info' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = (req, res, next) => {
  try {
    const store = getStore();
    const users = store.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      className: u.className,
      createdAt: u.createdAt
    }));

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    const store = getStore();

    store.users = store.users.filter(u => u.id !== userId);
    res.json({ success: true, message: `User ${userId} deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getAllUsers,
  deleteUser
};
