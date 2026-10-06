import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <HelpCircle className="w-16 h-16 text-blue-500 animate-bounce" />
        <h1 className="text-4xl font-extrabold">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md">The page you are looking for might have been moved or does not exist.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};
