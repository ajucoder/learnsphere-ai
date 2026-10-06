import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginDemo } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (roleKey) => {
    setLoading(true);
    try {
      const user = await loginDemo(roleKey);
      addToast(`Logged in as Demo ${user.role}: ${user.name}`, 'success');
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Sign In to LearnSphere AI</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">NCERT-Aligned Learning Platform for Classes 6-8</p>
          </div>

          {/* 1-Click Demo Logins Card */}
          <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" /> 1-Click Demo Presets
              </span>
              <span className="text-[10px] bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded font-semibold uppercase">Instant Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(DEMO_USERS).map((roleKey) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleDemoLogin(roleKey)}
                  className="text-xs font-bold py-2 px-3 bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-900 dark:text-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all shadow-sm flex items-center justify-between"
                >
                  <span className="capitalize">{roleKey}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@learnsphere.ai"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
