const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit AI requests to 30 per minute per IP
  message: {
    success: false,
    message: 'AI Rate Limit: You are asking questions too quickly. Please pause for a moment.'
  }
});

module.exports = { apiLimiter, aiLimiter };
