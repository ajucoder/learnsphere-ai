import React from 'react';
import { Link } from 'react-router-dom';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Sparkles,
  BookOpen,
  Bot,
  Award,
  Zap,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              Classes 6, 7 & 8 NCERT-Aligned Learning
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
              Learn Smarter. Practice Better.{' '}
              <span className="gradient-text">Grow Every Day.</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              An intelligent, interactive educational platform engineered for middle school students. Featuring chapter-wise NCERT lessons, automated quizzes, assignment workflows, and an age-appropriate AI Tutor powered by RAG context retrieval.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                Start Learning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/classes"
                className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md transition-all flex items-center gap-2 text-base"
              >
                <BookOpen className="w-5 h-5 text-blue-500" /> Explore Classes 6-8
              </Link>
            </div>

            {/* Platform Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 text-left">
              <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">NCERT Aligned</div>
                  <div className="text-xs text-slate-500">Classes 6, 7 & 8</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600"><Bot className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">AI Tutor + RAG</div>
                  <div className="text-xs text-slate-500">Guided Learning</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600"><Award className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">Gamified XP</div>
                  <div className="text-xs text-slate-500">Badges & Streaks</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600"><ShieldCheck className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">4 Role Dashboards</div>
                  <div className="text-xs text-slate-500">Student, Teacher, Parent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Cards Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Choose Your Class</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Comprehensive curriculum coverage across Science, Mathematics & Social Science</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Class 6 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 p-8 rounded-3xl border border-blue-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                6
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Class 6 NCERT</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Foundational Science (Food Sources, Components of Food) & Mathematics (Integers, Number Line).
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interactive Chapter Lessons</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Timed Chapter Quizzes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated AI Tutor Support</li>
              </ul>
              <Link to="/classes?class=Class%206" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 pt-2">
                Explore Class 6 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Class 7 */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 p-8 rounded-3xl border border-purple-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                7
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Class 7 NCERT</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                In-depth Science (Nutrition in Plants, Photosynthesis, Heat) & Mathematics (Integers & Fractions).
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Video & Text Lessons</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Assignment Workflows</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> RAG Knowledge Search</li>
              </ul>
              <Link to="/classes?class=Class%207" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 pt-2">
                Explore Class 7 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Class 8 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 p-8 rounded-3xl border border-emerald-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                8
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Class 8 NCERT</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Advanced Science (Crop Management, Microorganisms) & Mathematics (Linear Equations).
              </p>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Practice Problem Sets</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Quiz Generator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Progress & Badge Tracking</li>
              </ul>
              <Link to="/classes?class=Class%208" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-2">
                Explore Class 8 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Is LearnSphere AI officially affiliated with NCERT?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. LearnSphere AI is an independent educational technology platform designed to align with the Class 6, 7, and 8 NCERT curriculum structure. It is not officially owned, operated, or endorsed by NCERT.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">How does the AI Tutor ensure student safety?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The AI Tutor runs through backend moderation guardrails. If a student asks the AI to complete graded homework for them, the AI automatically shifts to a guided learning mode—providing step-by-step hints and encouraging explanations instead of giving direct raw solutions.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Can teachers and parents use LearnSphere AI?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! LearnSphere AI provides dedicated dashboards for Teachers (quiz generation, assignment creation, student grading) and Parents (child study hours, accuracy trends, AI safety logs).
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
