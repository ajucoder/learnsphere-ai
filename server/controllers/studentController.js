const { getStore } = require('../config/db');
const { XP_RULES, BADGES } = require('../config/constants');

const getChapters = (req, res, next) => {
  try {
    const { className = 'Class 7', subject } = req.query;
    const store = getStore();

    let chapters = store.contents.filter(c => c.class.toLowerCase() === className.toLowerCase());
    if (subject) {
      chapters = chapters.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
    }

    res.json({ success: true, count: chapters.length, chapters });
  } catch (error) {
    next(error);
  }
};

const getChapterById = (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const store = getStore();

    const chapter = store.contents.find(c => c.id === chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found.' });
    }

    res.json({ success: true, chapter });
  } catch (error) {
    next(error);
  }
};

const completeLesson = (req, res, next) => {
  try {
    const { lessonId } = req.body;
    const studentId = req.user.id;
    const store = getStore();

    let progress = store.progresses.find(p => p.studentId === studentId);
    if (!progress) {
      progress = {
        studentId,
        xp: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessons: [],
        badges: ['first_step'],
        quizHistory: []
      };
      store.progresses.push(progress);
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.xp += XP_RULES.LESSON_COMPLETE;

      // Unlock badges if criteria met
      if (progress.completedLessons.length >= 5 && !progress.badges.includes('science_star')) {
        progress.badges.push('science_star');
      }
    }

    res.json({
      success: true,
      message: 'Lesson completed! +20 XP',
      xpGained: XP_RULES.LESSON_COMPLETE,
      progress
    });
  } catch (error) {
    next(error);
  }
};

const getStudentProgress = (req, res, next) => {
  try {
    const studentId = req.user.id;
    const store = getStore();

    let progress = store.progresses.find(p => p.studentId === studentId);
    if (!progress) {
      progress = {
        studentId,
        xp: 350,
        streakDays: 4,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessons: ['les_c7_s1_01', 'les_c7_s1_02'],
        badges: ['first_step', 'quiz_whiz', 'streak_3'],
        quizHistory: [
          {
            quizId: 'qz_sci_c7_01',
            title: 'Nutrition in Plants Mastery Quiz',
            score: 100,
            xpEarned: 80,
            completedAt: new Date().toISOString()
          }
        ]
      };
      store.progresses.push(progress);
    }

    const populatedBadges = BADGES.map(b => ({
      ...b,
      unlocked: progress.badges.includes(b.id)
    }));

    res.json({
      success: true,
      progress: {
        ...progress,
        badgesDetails: populatedBadges
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChapters,
  getChapterById,
  completeLesson,
  getStudentProgress
};
