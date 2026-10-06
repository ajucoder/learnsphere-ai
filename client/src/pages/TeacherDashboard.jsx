import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Users,
  Bot,
  PlusCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  BarChart2,
  Award,
  Send,
  Zap,
  Edit,
  Trash
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Quiz Generator Modal State
  const [aiQuizModal, setAiQuizModal] = useState(false);
  const [quizTopic, setQuizTopic] = useState('Photosynthesis & Plant Nutrition');
  const [quizClass, setQuizClass] = useState('Class 7');
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  // Create Assignment Modal State
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgClass, setAsgClass] = useState('Class 7');
  const [asgSubject, setAsgSubject] = useState('Science');
  const [asgInstructions, setAsgInstructions] = useState('');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const [analyticsData, studentsData] = await Promise.all([
        api.get('/teacher/analytics'),
        api.get('/teacher/students')
      ]);
      setAnalytics(analyticsData.analytics);
      setStudents(studentsData.students || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIQuiz = async () => {
    if (!quizTopic.trim()) return;
    setGeneratingQuiz(true);
    try {
      const data = await api.post('/teacher/generate-quiz', {
        topic: quizTopic,
        className: quizClass,
        numQuestions: 3
      });
      setGeneratedQuestions(data.questions || []);
      addToast(`AI generated ${data.questions.length} questions!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (generatedQuestions.length === 0) return;
    try {
      await api.post('/quizzes', {
        title: `${quizTopic} AI Quiz`,
        subject: 'Science',
        className: quizClass,
        questions: generatedQuestions
      });
      addToast('Quiz published to student portal!', 'success');
      setAiQuizModal(false);
      setGeneratedQuestions([]);
      fetchTeacherData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateAssignment = async () => {
    if (!asgTitle.trim()) return;
    try {
      await api.post('/assignments', {
        title: asgTitle,
        className: asgClass,
        subject: asgSubject,
        instructions: asgInstructions
      });
      addToast('Assignment published successfully!', 'success');
      setAssignmentModal(false);
      setAsgTitle('');
      setAsgInstructions('');
      fetchTeacherData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const COLORS = ['#0284c7', '#7c3aed', '#059669', '#d97706'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Teacher Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Users className="w-3.5 h-3.5" /> Teacher & Content Management Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name || 'Priya Verma'}</h1>
            <p className="text-sm text-indigo-100 opacity-90">Science & Mathematics Lead • Classes 6, 7 & 8</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAiQuizModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-purple-600 animate-bounce" /> AI Quiz Generator
            </button>
            <button
              onClick={() => setAssignmentModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-indigo-950/80 text-white hover:bg-indigo-900 border border-white/20 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Create Assignment
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Students</div>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{analytics?.totalStudents || 45}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Quizzes</div>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{analytics?.totalQuizzes || 8}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assignments</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{analytics?.totalAssignments || 12}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Grading</div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{analytics?.pendingSubmissions || 3}</div>
          </div>
        </div>

        {/* Student Roster Table & Class Analytics Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Roster (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" /> Student Progress & XP Roster
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{students.length} Students Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">XP Earned</th>
                    <th className="py-3 px-3">Streak</th>
                    <th className="py-3 px-3">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-100">{s.name}</td>
                      <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">{s.className}</span></td>
                      <td className="py-3 px-3 font-extrabold text-amber-600">{s.xp} XP</td>
                      <td className="py-3 px-3 font-bold text-rose-500">🔥 {s.streakDays} days</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">🏆 {s.badgesCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Distribution Chart (1 Col) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-600" /> Class Performance Analytics
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.subjectPerformance || []}>
                  <XAxis dataKey="subject" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      {/* AI Quiz Generator Modal */}
      {aiQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" /> AI Quiz Generator
              </h3>
              <button onClick={() => setAiQuizModal(false)} className="text-xs font-bold opacity-60 hover:opacity-100">Close</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Class Level</label>
                <select
                  value={quizClass}
                  onChange={(e) => setQuizClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAIQuiz}
              disabled={generatingQuiz}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {generatingQuiz ? 'AI Generating Questions...' : 'Generate 3 NCERT Questions'} <Zap className="w-4 h-4" />
            </button>

            {generatedQuestions.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-emerald-600">Generated Questions Preview:</div>
                {generatedQuestions.map((q, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Q{i+1}: {q.questionText}</div>
                    <div className="text-[11px] text-slate-500">Correct: Option {q.correctAnswer + 1} ({q.options[q.correctAnswer]})</div>
                  </div>
                ))}
                <button
                  onClick={handleSaveQuiz}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  Publish Quiz to Class
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {assignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Assignment</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
              <input
                type="text"
                value={asgTitle}
                onChange={(e) => setAsgTitle(e.target.value)}
                placeholder="e.g. Photosynthesis Diagram Activity"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instructions</label>
              <textarea
                rows={3}
                value={asgInstructions}
                onChange={(e) => setAsgInstructions(e.target.value)}
                placeholder="Detail instructions for students..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setAssignmentModal(false)} className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-600">Cancel</button>
              <button onClick={handleCreateAssignment} className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md">Publish Assignment</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
