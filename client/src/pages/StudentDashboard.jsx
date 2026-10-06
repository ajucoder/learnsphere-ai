import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AITutorChat } from '../components/ai/AITutorChat';
import {
  Sparkles,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Bot,
  FileText,
  TrendingUp,
  Flame,
  ChevronRight,
  Send
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [selectedClass, setSelectedClass] = useState(user?.className || 'Class 7');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chapters');

  // Submission Modal state
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedSubject]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chData, progData, asgData] = await Promise.all([
        api.get(`/student/chapters?className=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(selectedSubject)}`),
        api.get('/student/progress'),
        api.get(`/assignments?className=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(selectedSubject)}`)
      ]);

      setChapters(chData.chapters || []);
      setProgress(progData.progress || null);
      setAssignments(asgData.assignments || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!submissionText.trim() || !submittingAssignment) return;
    try {
      await api.post(`/assignments/${submittingAssignment.id}/submit`, { submissionText });
      addToast('Assignment submitted successfully!', 'success');
      setSubmittingAssignment(null);
      setSubmissionText('');
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Performance data for Recharts
  const subjectPerformanceData = [
    { subject: 'Science', score: 88, fullMark: 100 },
    { subject: 'Math', score: 92, fullMark: 100 },
    { subject: 'Social Sci', score: 84, fullMark: 100 },
    { subject: 'English', score: 90, fullMark: 100 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header & Gamification Bar */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Student Learning Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name || 'Aarav'}! 🚀</h1>
            <p className="text-sm text-blue-100 opacity-90">
              NCERT Curriculum • Currently studying <strong className="underline decoration-amber-400 decoration-2">{selectedClass} {selectedSubject}</strong>
            </p>
          </div>

          {/* Gamification Stats Cards */}
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="text-center px-3">
              <div className="flex items-center justify-center text-amber-300 font-extrabold text-2xl gap-1">
                <Zap className="w-6 h-6 fill-amber-300" /> {progress?.xp || 350}
              </div>
              <div className="text-[11px] text-blue-100 font-semibold uppercase tracking-wider">Total XP</div>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="text-center px-3">
              <div className="flex items-center justify-center text-rose-300 font-extrabold text-2xl gap-1">
                <Flame className="w-6 h-6 fill-rose-300 animate-pulse" /> {progress?.streakDays || 4}
              </div>
              <div className="text-[11px] text-blue-100 font-semibold uppercase tracking-wider">Day Streak</div>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="text-center px-3">
              <div className="flex items-center justify-center text-emerald-300 font-extrabold text-2xl gap-1">
                <Award className="w-6 h-6" /> {progress?.badges?.length || 3}
              </div>
              <div className="text-[11px] text-blue-100 font-semibold uppercase tracking-wider">Badges</div>
            </div>
          </div>
        </div>

        {/* Class & Subject Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Class Select Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Class Level:</span>
            {['Class 6', 'Class 7', 'Class 8'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedClass === cls
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Subject Select Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Subject:</span>
            {['Science', 'Mathematics', 'Social Science', 'English'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSubject === sub
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Chapters, Lessons, Assignments */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'chapters'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Chapters & Lessons ({chapters.length})
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'assignments'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <FileText className="w-4 h-4" /> Assignments ({assignments.length})
              </button>
            </div>

            {/* Chapters Tab */}
            {activeTab === 'chapters' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="p-8 text-center text-slate-400 font-medium">Loading NCERT chapters...</div>
                ) : chapters.length === 0 ? (
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-700 dark:text-slate-300">No chapters found for {selectedClass} {selectedSubject}</h4>
                    <p className="text-xs text-slate-500">Try selecting Class 7 Science or Class 7 Mathematics to view seeded NCERT modules.</p>
                  </div>
                ) : (
                  chapters.map((ch) => (
                    <div key={ch.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 hover:border-blue-300 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Chapter {ch.chapterNumber}</span>
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{ch.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ch.description}</p>
                        </div>
                      </div>

                      {/* Lessons List inside Chapter */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lessons & Practice:</div>
                        {ch.lessons?.map((les) => (
                          <div key={les.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                              <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{les.title}</div>
                                <div className="text-xs text-slate-500 line-clamp-1">{les.summary}</div>
                              </div>
                            </div>
                            <a
                              href={`/chapter/${ch.id}`}
                              className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
                            >
                              Study Lesson <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {assignments.map((asg) => (
                  <div key={asg.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{asg.subject} • {asg.className}</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{asg.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{asg.instructions}</p>
                      </div>
                      <span className="text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                        Max Marks: {asg.maxMarks}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Due Date: {new Date(asg.dueDate).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSubmittingAssignment(asg)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Work
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recharts Performance Radar & Badges Gallery */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Subject Mastery & Analytics
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformanceData}>
                    <XAxis dataKey="subject" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0284c7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Dedicated AI Tutor Sidebar Widget */}
          <div className="space-y-6">
            <AITutorChat defaultClass={selectedClass} defaultSubject={selectedSubject} />

            {/* Badges Gallery Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Earned Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {progress?.badgesDetails?.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                      b.unlocked
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-2xl">{b.icon}</div>
                    <div className="font-bold text-xs">{b.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{b.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Submit Work: {submittingAssignment.title}
            </h3>
            <p className="text-xs text-slate-500">{submittingAssignment.instructions}</p>

            <textarea
              rows={5}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your submission answers or explanations here..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignmentSubmit}
                disabled={!submissionText.trim()}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
