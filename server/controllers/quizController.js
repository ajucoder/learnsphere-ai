const { getStore } = require('../config/db');
const { XP_RULES } = require('../config/constants');

const getQuizById = (req, res, next) => {
  try {
    const { quizId } = req.params;
    const store = getStore();

    const quiz = store.quizzes.find(q => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

const getQuizzesByChapter = (req, res, next) => {
  try {
    const { chapterId } = req.query;
    const store = getStore();

    const quizzes = store.quizzes.filter(q => q.chapterId === chapterId);
    res.json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    next(error);
  }
};

const submitQuiz = (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { userAnswers } = req.body; // Map of questionId -> selectedIndex
    const studentId = req.user.id;
    const store = getStore();

    const quiz = store.quizzes.find(q => q.id === quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    let correctCount = 0;
    const detailedResults = quiz.questions.map((q, index) => {
      const selected = userAnswers ? userAnswers[q.id] : null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOption: selected,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;

    // Calculate XP
    let xpEarned = correctCount * XP_RULES.QUIZ_PER_CORRECT;
    if (percentage === 100) xpEarned += XP_RULES.PERFECT_QUIZ_BONUS;

    // Update Student Progress
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

    progress.xp += xpEarned;
    if (percentage === 100 && !progress.badges.includes('quiz_whiz')) {
      progress.badges.push('quiz_whiz');
    }

    progress.quizHistory.unshift({
      quizId,
      title: quiz.title,
      score: percentage,
      xpEarned,
      completedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      score: percentage,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      xpEarned,
      detailedResults
    });
  } catch (error) {
    next(error);
  }
};

const createQuiz = (req, res, next) => {
  try {
    const { title, subject, className, chapterId, timeLimitMinutes = 10, questions } = req.body;
    const store = getStore();

    const newQuiz = {
      id: `qz_${Date.now()}`,
      chapterId: chapterId || 'ch_sci_c7_01',
      title,
      subject,
      className,
      timeLimitMinutes,
      passingScore: 70,
      questions: questions || []
    };

    store.quizzes.push(newQuiz);
    res.status(201).json({ success: true, message: 'Quiz created successfully!', quiz: newQuiz });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizById,
  getQuizzesByChapter,
  submitQuiz,
  createQuiz
};
