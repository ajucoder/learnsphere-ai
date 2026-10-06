const { generateTutorResponse, generateQuizQuestions } = require('../services/aiService');

const askTutor = async (req, res, next) => {
  try {
    const { prompt, className = 'Class 7', subject = 'Science' } = req.body;
    const isDirectSolveRequest = req.isDirectSolveRequest || false;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt/Question is required.' });
    }

    const result = await generateTutorResponse({
      prompt,
      className,
      subject,
      isDirectSolveRequest
    });

    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      provider: result.provider,
      isGuidedLearning: isDirectSolveRequest
    });
  } catch (error) {
    next(error);
  }
};

const createAIQuiz = async (req, res, next) => {
  try {
    const { topic, numQuestions = 3, difficulty = 'Medium', className = 'Class 7' } = req.body;

    const questions = await generateQuizQuestions({ topic, numQuestions, difficulty, className });

    res.json({
      success: true,
      message: 'AI Quiz questions generated successfully.',
      questions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askTutor,
  createAIQuiz
};
