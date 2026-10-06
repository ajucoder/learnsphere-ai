import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: { email: 'student@learnsphere.ai', password: 'password123', label: 'Student (Aarav Sharma - Class 7)' },
  teacher: { email: 'teacher@learnsphere.ai', password: 'password123', label: 'Teacher (Priya Verma - Science/Math)' },
  parent: { email: 'parent@learnsphere.ai', password: 'password123', label: 'Parent (Rajesh Sharma)' },
  admin: { email: 'admin@learnsphere.ai', password: 'password123', label: 'Admin (System Administrator)' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('learnsphere_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
    } catch (err) {
      console.warn('Auth verification failed:', err.message);
      localStorage.removeItem('learnsphere_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('learnsphere_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const loginDemo = async (roleKey) => {
    const credentials = DEMO_USERS[roleKey];
    if (!credentials) return;
    return await login(credentials.email, credentials.password);
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    localStorage.setItem('learnsphere_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('learnsphere_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginDemo, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
