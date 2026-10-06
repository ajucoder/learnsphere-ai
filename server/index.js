const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectDB } = require('./config/db');
const { seedData } = require('./services/seedService');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Import Route Handlers
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const parentRoutes = require('./routes/parent.routes');
const adminRoutes = require('./routes/admin.routes');
const quizRoutes = require('./routes/quiz.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', apiLimiter);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'LearnSphere AI Platform API',
    timestamp: new Date().toISOString(),
    ncertAlignment: 'Classes 6-8 NCERT Aligned (Independent Educational Tool)'
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use(errorHandler);

// Server Initialization
const startServer = async () => {
  const isMongo = await connectDB();
  // Auto-seed mock data so app works immediately
  await seedData();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 LearnSphere AI Server running on port ${PORT}`);
    console.log(`🌐 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
};

startServer();

module.exports = app;
