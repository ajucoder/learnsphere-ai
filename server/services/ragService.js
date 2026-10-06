const fs = require('fs');
const path = require('path');

let knowledgeBase = [];

try {
  const kbPath = path.join(__dirname, '../data/ncertKnowledgeBase.json');
  const rawData = fs.readFileSync(kbPath, 'utf8');
  knowledgeBase = JSON.parse(rawData);
} catch (err) {
  console.error('[RAG Service] Error loading NCERT knowledge base:', err.message);
  knowledgeBase = [];
}

/**
 * Basic Term-Frequency / Keyword Relevance Scoring for RAG retrieval
 * (Simulates vector cosine similarity search over authorized NCERT chunks)
 */
const retrieveRelevantChunks = (query, className, subjectName, topK = 3) => {
  if (!query || knowledgeBase.length === 0) return [];

  const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);

  const scored = knowledgeBase.map(chunk => {
    let score = 0;

    // Filter boost for matching Class or Subject
    if (className && chunk.class.toLowerCase() === className.toLowerCase()) score += 5;
    if (subjectName && chunk.subject.toLowerCase() === subjectName.toLowerCase()) score += 5;

    // Token match scoring
    queryTokens.forEach(token => {
      if (chunk.keywords.some(k => k.toLowerCase().includes(token))) score += 4;
      if (chunk.topic.toLowerCase().includes(token)) score += 3;
      if (chunk.content.toLowerCase().includes(token)) score += 1;
      if (chunk.chapter.toLowerCase().includes(token)) score += 2;
    });

    return { ...chunk, score };
  });

  // Sort by relevance score descending
  const results = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
};

module.exports = {
  retrieveRelevantChunks,
  getKnowledgeBaseCount: () => knowledgeBase.length
};
