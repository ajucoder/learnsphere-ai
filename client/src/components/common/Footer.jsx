import React from 'react';
import { Sparkles, Shield, Heart, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                LearnSphere <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              A modern, AI-powered educational platform engineered specifically for middle school students (Classes 6, 7 & 8). Harnessing Retrieval-Augmented Generation (RAG) and friendly tutoring guardrails to make NCERT concept learning engaging, interactive, and safe.
            </p>

            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-xs text-amber-300/90 leading-normal">
              <strong>Notice:</strong> LearnSphere AI is an independent educational tool designed to align with Class 6-8 curricula. It is not officially owned, operated, endorsed, or affiliated with the National Council of Educational Research and Training (NCERT).
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Curriculum & Classes</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/classes" className="hover:text-blue-400 transition-colors">Class 6 Science & Math</a></li>
              <li><a href="/classes" className="hover:text-blue-400 transition-colors">Class 7 Science & Math</a></li>
              <li><a href="/classes" className="hover:text-blue-400 transition-colors">Class 8 Science & Math</a></li>
              <li><a href="/ai-tutor" className="hover:text-blue-400 transition-colors">Interactive AI Tutor</a></li>
            </ul>
          </div>

          {/* Platform & Safety */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Age-Appropriate AI</li>
              <li className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> Gamified XP & Badges</li>
              <li><a href="#faq" className="hover:text-blue-400 transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Student Data Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LearnSphere AI. Engineered for educational excellence.</p>
          <div className="flex items-center gap-4">
            <span>Accessibility (WCAG 2.1 AA)</span>
            <span>•</span>
            <span>Privacy-Safe Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
