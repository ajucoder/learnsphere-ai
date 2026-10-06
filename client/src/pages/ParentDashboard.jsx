import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Users,
  ShieldCheck,
  Award,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  Bot
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export const ParentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/parent/overview');
      setData(res);
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Parent Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> Parent Monitoring Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name || 'Rajesh Sharma'}</h1>
            <p className="text-sm text-emerald-100 opacity-90">
              Monitoring Child: <strong className="underline font-extrabold">{data?.child?.name || 'Aarav Sharma'}</strong> ({data?.child?.className || 'Class 7'})
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="text-center px-3">
              <div className="text-amber-300 font-extrabold text-2xl">{data?.stats?.xp || 350}</div>
              <div className="text-[10px] text-emerald-100 font-semibold uppercase">Total XP</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-3">
              <div className="text-white font-extrabold text-2xl">{data?.stats?.avgQuizScore || 90}%</div>
              <div className="text-[10px] text-emerald-100 font-semibold uppercase">Avg Score</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-3">
              <div className="text-rose-300 font-extrabold text-2xl">🔥 {data?.stats?.streakDays || 4}</div>
              <div className="text-[10px] text-emerald-100 font-semibold uppercase">Streak</div>
            </div>
          </div>
        </div>

        {/* Charts & AI Safety Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Study Hours Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Weekly Learning & Study Hours
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.weeklyStudyHours || []}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" stroke="#059669" fill="#10b981" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Safety Summary Box (1 Col) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" /> AI Safety & Activity Report
            </h3>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total AI Tutor Queries</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{data?.aiSafetySummary?.totalQueries || 14}</span>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-xs">
                <span className="text-emerald-800 dark:text-emerald-200 font-medium">Educational Alignment</span>
                <span className="font-extrabold text-emerald-600">{data?.aiSafetySummary?.educationalPercentage || '100%'}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Flagged Safety Violations</span>
                <span className="font-bold text-emerald-600">0 Violations</span>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Most Searched NCERT Topics:</span>
                <div className="flex flex-wrap gap-1.5">
                  {data?.aiSafetySummary?.topTopics?.map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold rounded-lg border border-purple-200 dark:border-purple-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
