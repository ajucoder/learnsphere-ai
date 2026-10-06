import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Zap,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export const QuizRunner = ({ quiz, onComplete }) => {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((quiz.timeLimitMinutes || 10) * 60);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitted || loading) return;
    setLoading(true);

    try {
      const data = await api.post(`/quizzes/${quiz.id}/submit`, { userAnswers });
      setResults(data);
      setSubmitted(true);
      addToast(`Quiz Completed! You scored ${data.score}% (+${data.xpEarned} XP)`, data.passed ? 'success' : 'info');
      if (onComplete) onComplete(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = quiz.questions[currentStep];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (submitted && results) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {results.passed ? 'Congratulations! 🎉' : 'Keep Practicing! 💪'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {quiz.title} • {quiz.className} {quiz.subject}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{results.score}%</div>
            <div className="text-xs text-slate-500">Final Score</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">+{results.xpEarned}</div>
            <div className="text-xs text-slate-500">XP Earned</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{results.correctCount}/{results.totalQuestions}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
        </div>

        <div className="text-left space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Answer Explanations:</h3>
          {results.detailedResults.map((r, i) => (
            <div key={i} className={`p-4 rounded-xl border text-sm space-y-1 ${r.isCorrect ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800' : 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800'}`}>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                {r.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                Q{i+1}: {r.questionText}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                <strong>Explanation:</strong> {r.explanation}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setSubmitted(false); setResults(null); setCurrentStep(0); setUserAnswers({}); setTimeLeft(quiz.timeLimitMinutes * 60); }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" /> Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6">
      {/* Header & Timer */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{quiz.subject} • {quiz.className}</span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 font-mono font-bold text-sm">
          <Clock className="w-4 h-4 animate-pulse" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Question {currentStep + 1} of {quiz.questions.length}</span>
          <span>{Math.round(((currentStep + 1) / quiz.questions.length) * 100)}% Progress</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="space-y-4 py-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {currentQ.questionText}
        </h3>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = userAnswers[currentQ.id] === optIndex;
            return (
              <button
                key={optIndex}
                onClick={() => handleSelectOption(currentQ.id, optIndex)}
                className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-900 dark:text-blue-100 shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    {String.fromCharCode(65 + optIndex)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition-colors"
        >
          Previous
        </button>

        {currentStep < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={userAnswers[currentQ.id] === undefined}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
          >
            Next Question <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || Object.keys(userAnswers).length === 0}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
          >
            {loading ? 'Submitting...' : 'Submit Quiz'} <Zap className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
