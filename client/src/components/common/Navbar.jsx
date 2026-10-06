import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  BookOpen,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  X,
  Bot,
  Award,
  Users
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, loginDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleDemoSwitch = async (roleKey) => {
    await loginDemo(roleKey);
    setDemoMenuOpen(false);
    navigate(`/dashboard/${roleKey}`);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight gradient-text">
                LearnSphere <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold uppercase">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1">NCERT Aligned • Classes 6-8</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/classes" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Classes 6-8
            </Link>
            <Link to="/ai-tutor" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-500" /> AI Tutor
            </Link>
            {user && (
              <Link to={`/dashboard/${user.role}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-500" /> Dashboard
              </Link>
            )}
          </div>

          {/* Action Tools & Auth Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick 1-Click Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> 1-Click Demo Roles
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Active Role</div>
                  {Object.keys(DEMO_USERS).map(roleKey => (
                    <button
                      key={roleKey}
                      onClick={() => handleDemoSwitch(roleKey)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between text-slate-700 dark:text-slate-200 font-medium"
                    >
                      <span className="capitalize font-semibold">{roleKey}</span>
                      <span className="text-[10px] text-slate-400">{DEMO_USERS[roleKey].label.split('(')[1]?.replace(')', '')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Color Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Profile / Login Button */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.name}</div>
                  <div className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400">{user.role} {user.className && `• ${user.className}`}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-xs font-semibold px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors">
                  Start Learning
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <Link to="/classes" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-200">
            Classes 6-8
          </Link>
          <Link to="/ai-tutor" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-purple-600 dark:text-purple-400">
            🤖 AI Tutor
          </Link>
          {user && (
            <Link to={`/dashboard/${user.role}`} onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-blue-600">
              Dashboard ({user.role})
            </Link>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-2">Switch Demo Account:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(DEMO_USERS).map(r => (
                <button
                  key={r}
                  onClick={() => { handleDemoSwitch(r); setMobileMenuOpen(false); }}
                  className="text-xs py-1.5 px-2 bg-slate-100 dark:bg-slate-800 rounded font-semibold capitalize text-slate-700 dark:text-slate-300"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
