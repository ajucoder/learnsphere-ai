import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  ShieldAlert,
  Users,
  Bot,
  Activity,
  Trash2,
  CheckCircle2,
  FileText,
  Search,
  Server
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsData, usersData] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users')
      ]);
      setMetrics(analyticsData);
      setUsersList(usersData.users || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete user ${userId}?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      addToast('User deleted successfully.', 'success');
      fetchAdminData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
              <Server className="w-3.5 h-3.5 text-blue-400" /> Platform Admin Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name || 'System Administrator'}</h1>
            <p className="text-sm text-slate-300 opacity-90">Manage Platform Users, Monitor AI Usage & System Audit Logs</p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-center px-3">
              <div className="text-emerald-400 font-extrabold text-2xl">{metrics?.metrics?.totalUsers || 4}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Users</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center px-3">
              <div className="text-purple-400 font-extrabold text-2xl">{metrics?.metrics?.aiQueriesToday || 184}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">AI Queries</div>
            </div>
          </div>
        </div>

        {/* User Management Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> User Management
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name or role..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">{u.name}</td>
                    <td className="py-3 px-3 text-slate-500">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-extrabold capitalize ${
                        u.role === 'student' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                        u.role === 'teacher' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                        u.role === 'parent' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                        'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{u.className || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Usage & Audit Log Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Usage Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" /> AI Usage & Token Consumption
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.aiUsageTrend || []}>
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="queries" stroke="#7c3aed" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Audit Logs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Platform Security & Audit Log
            </h3>
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {metrics?.auditLogs?.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{log.action}</div>
                    <div className="text-[11px] text-slate-500">{log.details}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
