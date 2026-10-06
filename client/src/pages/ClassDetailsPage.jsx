import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BookOpen, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const ClassDetailsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedClass = searchParams.get('class') || 'Class 7';
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, [selectedClass, selectedSubject]);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/student/chapters?className=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(selectedSubject)}`);
      setChapters(res.chapters || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Class Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" /> NCERT Course Catalog
          </div>
          <h1 className="text-3xl font-extrabold">{selectedClass} Curriculum Explorer</h1>
          <p className="text-sm text-blue-100 max-w-2xl opacity-90">
            Browse structured chapters, lessons, practice questions, and quizzes designed specifically for {selectedClass} students.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Select Class:</span>
            {['Class 6', 'Class 7', 'Class 8'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSearchParams({ class: cls })}
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Subject:</span>
            {['Science', 'Mathematics', 'Social Science', 'English'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12 text-slate-400">Loading curriculum chapters...</div>
          ) : chapters.length === 0 ? (
            <div className="col-span-2 bg-white dark:bg-slate-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-slate-800 space-y-2">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">No chapters found for {selectedClass} {selectedSubject}</h3>
              <p className="text-xs text-slate-500">Switch to Class 7 Science or Class 7 Mathematics to view seeded NCERT modules.</p>
            </div>
          ) : (
            chapters.map((ch) => (
              <div key={ch.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Chapter {ch.chapterNumber}</span>
                    <span className="text-[11px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold">
                      {ch.lessons?.length || 0} Lessons
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{ch.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ch.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> NCERT Aligned
                  </span>
                  <Link
                    to={`/chapter/${ch.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1"
                  >
                    Open Chapter <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
