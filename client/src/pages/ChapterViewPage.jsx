import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AITutorChat } from '../components/ai/AITutorChat';
import { QuizRunner } from '../components/quiz/QuizRunner';
import {
  BookOpen,
  PlayCircle,
  FileText,
  HelpCircle,
  Award,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Bot
} from 'lucide-react';

export const ChapterViewPage = () => {
  const { chapterId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [chapter, setChapter] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapterDetails();
  }, [chapterId]);

  const fetchChapterDetails = async () => {
    setLoading(true);
    try {
      const [chRes, qzRes] = await Promise.all([
        api.get(`/student/chapters/${chapterId}`),
        api.get(`/quizzes/by-chapter?chapterId=${chapterId}`)
      ]);
      setChapter(chRes.chapter);
      if (chRes.chapter?.lessons?.length > 0) {
        setActiveLesson(chRes.chapter.lessons[0]);
      }
      setQuizzes(qzRes.quizzes || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    try {
      await api.post('/student/lesson/complete', { lessonId: activeLesson.id });
      addToast('Lesson marked complete! +20 XP awarded 🎯', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <DisclaimerBanner />
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">Loading chapter workspace...</div>
        <Footer />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <DisclaimerBanner />
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">Chapter not found.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <Link to="/classes" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>

        {/* Chapter Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              {chapter.className} • {chapter.subject} • Chapter {chapter.chapterNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{chapter.title}</h1>
            <p className="text-sm text-blue-100 opacity-90 max-w-2xl">{chapter.description}</p>
          </div>

          {quizzes.length > 0 && (
            <button
              onClick={() => setActiveQuiz(quizzes[0])}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 text-sm shrink-0"
            >
              <Zap className="w-5 h-5 fill-slate-900" /> Start Chapter Quiz
            </button>
          )}
        </div>

        {/* Active Quiz Runner Modal / Inline View */}
        {activeQuiz ? (
          <div className="space-y-4">
            <button onClick={() => setActiveQuiz(null)} className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Lesson View
            </button>
            <QuizRunner quiz={activeQuiz} onComplete={() => {}} />
          </div>
        ) : (
          /* Main Workspace Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2 Cols): Lesson Video, Text & Practice */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lesson Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
                {chapter.lessons?.map((les, index) => (
                  <button
                    key={les.id}
                    onClick={() => setActiveLesson(les)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      activeLesson?.id === les.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" /> Lesson {index + 1}: {les.title}
                  </button>
                ))}
              </div>

              {activeLesson && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                  {/* Video Embed */}
                  {activeLesson.videoUrl && (
                    <div className="aspect-video w-full bg-slate-950">
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Lesson Content & Summary */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{activeLesson.title}</h2>
                      <p className="text-xs text-slate-500 mt-1">{activeLesson.summary}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      {activeLesson.contentText}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleCompleteLesson}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Lesson Complete (+20 XP)
                      </button>

                      {quizzes.length > 0 && (
                        <button
                          onClick={() => setActiveQuiz(quizzes[0])}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                        >
                          Take Chapter Quiz <Zap className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (1 Col): AI Tutor Sidebar */}
            <div>
              <AITutorChat defaultClass={chapter.className} defaultSubject={chapter.subject} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
