import React from 'react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AITutorChat } from '../components/ai/AITutorChat';

export const AITutorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DisclaimerBanner />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold">LearnSphere AI Tutor Workspace</h1>
          <p className="text-sm text-slate-500">Ask questions, get step-by-step hints, or revise NCERT concepts safely.</p>
        </div>

        <AITutorChat defaultClass="Class 7" defaultSubject="Science" />
      </main>

      <Footer />
    </div>
  );
};
