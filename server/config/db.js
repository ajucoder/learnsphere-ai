const mongoose = require('mongoose');

// In-memory mock storage fallback when MongoDB connection is not available
const mockStore = {
  users: [],
  contents: [],
  quizzes: [],
  quizAttempts: [],
  assignments: [],
  submissions: [],
  progresses: [],
  aiConversations: [],
  auditLogs: []
};

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('--------------------------------------------------');
    console.log('[Database] MONGODB_URI not supplied in .env.');
    console.log('[Database] Initializing in-memory Mock Data Store for instant execution.');
    console.log('--------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] Mongoose connection error: ${error.message}`);
    console.warn('[Database Warning] Falling back to in-memory Mock Data Store.');
    return false;
  }
};

const getStore = () => mockStore;

module.exports = {
  connectDB,
  isDBConnected: () => isConnected,
  getStore
};
