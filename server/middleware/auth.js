const jwt = require('jsonwebtoken');
const { getStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'learnsphere_super_secret_jwt_key_2026_ncert_class6_8';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user ? req.user.role : 'none'}' does not have permission.`
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorize,
  JWT_SECRET
};
