import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  BookOpen,
  Lightbulb,
  FileText,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { label: 'Explain Photosynthesis', prompt: 'Explain Photosynthesis for Class 7 Science simply with everyday examples.', icon: Lightbulb },
  { label: 'Integers Rules', prompt: 'What are the rules for adding and multiplying negative integers?', icon: BookOpen },
  { label: 'Give Me a Hint', prompt: 'Can you give me a hint on how plants get water from soil?', icon: HelpCircle },
  { label: 'Summarize Lesson', prompt: 'Summarize the key points of Nutrition in Animals.', icon: FileText }
];

export const AITutorChat = ({ defaultClass = 'Class 7', defaultSubject = 'Science' }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! 👋 I am your **LearnSphere AI Tutor**.\n\nI can explain concepts, give hints, break down tricky math problems, or quiz you on NCERT topics for **${defaultClass} ${defaultSubject}**! How can I help you today?`,
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/tutor', {
        prompt: textToSend,
        className: user?.className || defaultClass,
        subject: defaultSubject
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.answer,
        sources: res.sources || [],
        provider: res.provider,
        isGuided: res.isGuidedLearning,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `⚠️ **Safety Guardrail / Connection Note**: ${err.message}`,
          sources: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              LearnSphere AI Tutor
              <span className="text-[10px] bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                RAG Active
              </span>
            </h3>
            <p className="text-xs text-blue-100/90">
              NCERT Knowledge Base • {user?.className || defaultClass} {defaultSubject}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg text-blue-100 flex items-center gap-1 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Safe Mode
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
        {SUGGESTED_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 text-blue-500" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[11px] font-bold opacity-75 flex items-center gap-1">
                  {msg.sender === 'ai' ? (
                    <>
                      <Bot className="w-3.5 h-3.5 text-purple-400" /> AI Tutor
                      {msg.isGuided && <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded font-extrabold">Guided Hint</span>}
                    </>
                  ) : (
                    user ? user.name : 'You'
                  )}
                </span>
                <span className="text-[10px] opacity-60">{msg.timestamp}</span>
              </div>

              <div className="text-sm leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              {/* RAG Knowledge Source Citation Badge */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-500" /> NCERT Sources:
                  </span>
                  {msg.sources.map((s, i) => (
                    <span key={i} className="bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-medium">
                      {s.chapter} • {s.topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <Bot className="w-5 h-5 text-purple-500 animate-spin" />
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="text-xs text-slate-500 ml-2 font-medium">Searching NCERT Knowledge Base...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${defaultClass} ${defaultSubject} (e.g. "Give me a hint on Q2")...`}
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold shadow-md transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
