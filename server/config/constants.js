module.exports = {
  ROLES: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    PARENT: 'parent',
    ADMIN: 'admin'
  },
  CLASSES: ['Class 6', 'Class 7', 'Class 8'],
  SUBJECTS: ['Science', 'Mathematics', 'Social Science', 'English'],
  XP_RULES: {
    QUIZ_PER_CORRECT: 10,
    PERFECT_QUIZ_BONUS: 50,
    LESSON_COMPLETE: 20,
    DAILY_STREAK_BONUS: 15,
    ASSIGNMENT_SUBMIT: 30
  },
  BADGES: [
    { id: 'first_step', name: 'First Step', description: 'Completed your first lesson', icon: '🚀' },
    { id: 'quiz_whiz', name: 'Quiz Whiz', description: 'Scored 100% on a quiz', icon: '🎯' },
    { id: 'streak_3', name: 'On Fire', description: 'Maintained a 3-day streak', icon: '🔥' },
    { id: 'science_star', name: 'Science Star', description: 'Completed 5 Science lessons', icon: '🔬' },
    { id: 'math_master', name: 'Math Master', description: 'Solved 10 Math practice problems', icon: '📐' },
    { id: 'ai_explorer', name: 'AI Explorer', description: 'Asked 5 questions to AI Tutor', icon: '🤖' }
  ]
};
