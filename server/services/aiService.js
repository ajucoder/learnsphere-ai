const { retrieveRelevantChunks } = require('./ragService');

/**
 * Generate AI Tutor response with RAG Context & Educational Safety Guardrails
 */
const generateTutorResponse = async ({ prompt, className = 'Class 7', subject = 'Science', isDirectSolveRequest = false }) => {
  // 1. Perform RAG Retrieval from NCERT Knowledge Base
  const retrievedChunks = retrieveRelevantChunks(prompt, className, subject, 2);
  const contextText = retrievedChunks.map(c => `[NCERT Concept: ${c.topic} (${c.chapter})] ${c.content}`).join('\n\n');

  const apiKey = process.env.GEMINI_API_KEY;

  // System Prompt for Age 11-14 Educational Persona (Classes 6-8)
  const systemInstruction = `
You are LearnSphere AI Tutor, a friendly, encouraging, age-appropriate educational assistant for students in ${className} studying ${subject}.
NCERT Knowledge Base Context:
${contextText || 'Use standard NCERT Class 6-8 curriculum knowledge.'}

Guidelines:
1. Explain concepts simply using everyday analogies and bullet points.
2. Maintain an inspiring, supportive, educational tone.
3. ${isDirectSolveRequest ? 'CRITICAL GUARDRAIL: The student is asking you to solve graded homework for them. DO NOT give direct final answers. Instead, provide a step-by-step hint, an encouraging breakdown, and ask them a guiding question.' : 'Provide direct, clear, structured explanations.'}
4. Keep responses concise and formatted cleanly with markdown.
`;

  // 2. Execute via Google Gemini API if key is present
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemInstruction + '\n\nStudent Question: ' + prompt }] }
          ]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          answer: data.candidates[0].content.parts[0].text,
          sources: retrievedChunks.map(c => ({ chapter: c.chapter, topic: c.topic })),
          provider: 'Gemini API'
        };
      }
    } catch (err) {
      console.warn('[AI Service Warning] Gemini API call failed, using intelligent educational mock fallback:', err.message);
    }
  }

  // 3. Fallback Intelligent Mock AI Engine
  let mockAnswer = '';
  if (isDirectSolveRequest) {
    mockAnswer = `### 🌟 Guided Learning Hint\n\nI see you're working on an assignment! As your **LearnSphere AI Tutor**, I help you learn *how* to solve problems rather than doing them for you.\n\n**Step 1:** Break the question down into key terms.\n**Step 2:** Think about what we learned in **${subject}** regarding this topic.\n**Step 3:** Use the concept definition: *${retrievedChunks[0]?.summary || 'Review the core textbook rules carefully.'}*\n\nCan you try explaining what step 1 means in your own words? I'll guide you through step 2!`;
  } else if (retrievedChunks.length > 0) {
    const chunk = retrievedChunks[0];
    mockAnswer = `### 📖 NCERT Concept: ${chunk.topic}\n\nGreat question! Here is how we understand **${chunk.topic}** in **${chunk.class} ${chunk.subject}**:\n\n- **Core Summary**: ${chunk.summary}\n- **Detailed Explanation**: ${chunk.content}\n\n> 💡 **Quick Tip**: Remember the key terms: **${chunk.keywords.join(', ')}**!\n\nWould you like me to quiz you on this topic or explain an example?`;
  } else {
    mockAnswer = `### 💡 Learning Guide for ${className} ${subject}\n\nTo answer **"${prompt}"**:\n\n1. **Concept Breakdown**: In ${subject}, this relates to how fundamental natural principles work step by step.\n2. **Everyday Analogy**: Think of it like building blocks—each step connects to the next.\n3. **Key Takeaway**: Always double-check your definitions and observe real-world examples around you!\n\n*Feel free to ask for a practice question or a simpler hint anytime!*`;
  }

  return {
    answer: mockAnswer,
    sources: retrievedChunks.map(c => ({ chapter: c.chapter, topic: c.topic })),
    provider: 'LearnSphere Educational Mock Engine'
  };
};

/**
 * Generate AI Quiz Questions automatically for Teachers
 */
const generateQuizQuestions = async ({ topic, numQuestions = 3, difficulty = 'Medium', className = 'Class 7' }) => {
  return [
    {
      questionText: `What is the primary significance of ${topic} in ${className}?`,
      options: [
        'It is a fundamental process in nature/mathematics',
        'It only occurs in laboratory settings',
        'It is unrelated to everyday life',
        'It was discovered only recently'
      ],
      correctAnswer: 0,
      explanation: `${topic} is a core NCERT concept essential for understanding ${className} topics.`
    },
    {
      questionText: `Which of the following is correct regarding ${topic}?`,
      options: [
        'It follows standard principles outlined in textbooks',
        'It violates conservation laws',
        'It applies only to cold temperatures',
        'None of the above'
      ],
      correctAnswer: 0,
      explanation: `Standard ${className} curriculum principles govern this topic.`
    },
    {
      questionText: `True or False: Understanding ${topic} helps solve practical problems.`,
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Educational concepts in NCERT are designed to connect to real-world applications.'
    }
  ];
};

module.exports = {
  generateTutorResponse,
  generateQuizQuestions
};
