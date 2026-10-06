const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = ROLES.STUDENT, className = 'Class 7' } = req.body;
    const store = getStore();

    const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      className,
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);

    // If student, initialize progress record
    if (role === ROLES.STUDENT) {
      store.progresses.push({
        studentId: newUser.id,
        xp: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedLessons: [],
        badges: ['first_step'],
        quizHistory: []
      });
    }

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, className: newUser.className },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, className: newUser.className }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const store = getStore();

    const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, className: user.className },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        className: user.className,
        studentId: user.studentId
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const store = getStore();
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        className: user.className,
        studentId: user.studentId
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
