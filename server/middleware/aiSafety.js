// AI Moderation, Prompt Injection & Age Safety Filter

const FORBIDDEN_KEYWORDS = [
  'jailbreak', 'ignore previous instructions', 'system prompt',
  'hack', 'explicit', 'violence', 'drugs', 'profanity', 'bypass'
];

const ASSIGNMENT_DO_MY_WORK_PATTERNS = [
  'do my assignment', 'write my full essay', 'solve all questions for me',
  'give me exact answers for test', 'cheat on quiz'
];

const aiSafetyFilter = (req, res, next) => {
  const { prompt, question, topic } = req.body;
  const input = (prompt || question || topic || '').toLowerCase();

  // Check for malicious prompt injections
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (input.includes(keyword)) {
      return res.status(400).json({
        success: false,
        message: 'Safety Guardrail Triggered: Query contains restricted or non-educational content.'
      });
    }
  }

  // Check if student is attempting to make AI solve entire graded work directly
  const isDirectSolveRequest = ASSIGNMENT_DO_MY_WORK_PATTERNS.some(pattern => input.includes(pattern));
  req.isDirectSolveRequest = isDirectSolveRequest;

  next();
};

module.exports = aiSafetyFilter;
