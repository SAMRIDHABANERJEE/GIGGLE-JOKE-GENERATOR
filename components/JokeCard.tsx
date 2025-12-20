
import React, { useEffect, useState } from 'react';
import { Joke } from '../types'; // Removed .ts

interface JokeCardProps {
  joke: Joke | null;
  loading: boolean;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke, loading }) => {
  const [revealPunchline, setRevealPunchline] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    "Injecting sarcasm...",
    "Verifying punchline safety...",
    "Synchronizing laugh tracks...",
    "Finalizing delivery style..."
  ];

  useEffect(() => {
    if (loading) {
      setRevealPunchline(false);
      const interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % steps.length);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (joke) {
      const timer = setTimeout(() => setRevealPunchline(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [joke]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl min-h-[350px] flex flex-col items-center justify-center p-10 glass rounded-[3rem] border-violet-500/20 shadow-2xl relative overflow-hidden">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-violet-500/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="font-mono text-violet-400 text-sm tracking-[0.2em] uppercase animate-pulse">
          {steps[loadingStep]}
        </p>
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-violet-600 to-pink-600 animate-[progress_2s_infinite]"></div>
      </div>
    );
  }

  if (!joke) {
    return (
      <div className="w-full max-w-2xl min-h-[350px] flex flex-col items-center justify-center p-12 text-center glass rounded-[3rem] border-white/10 group cursor-default">
        <div className="mb-8 p-6 rounded-full bg-violet-600/10 group-hover:bg-violet-600/20 transition-colors duration-700">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500 animate-bounce">
             <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
           </svg>
        </div>
        <h2 className="text-4xl font-display font-extrabold text-white mb-4 tracking-tight">System Idle.</h2>
        <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
          The humor matrix is empty. Select a frequency to begin neural transmission.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-10 md:p-16 glass rounded-[3rem] border-white/10 shadow-2xl relative group transition-all duration-500 hover:border-violet-500/30">
      <div className="space-y-12">
        <div className="relative">
          <span className="absolute -left-6 -top-2 text-violet-500/40 text-6xl font-serif select-none">“</span>
          <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            {joke.setup}
          </h3>
        </div>

        <div className={`transition-all duration-1000 transform ${revealPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 blur-sm'}`}>
          <div className="flex items-center gap-4 mb-4">
             <div className="h-[2px] flex-1 bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0"></div>
             <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-violet-500 uppercase">Neural Glitch</span>
             <div className="h-[2px] flex-1 bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0"></div>
          </div>
          <p className="text-2xl md:text-4xl font-display font-black bg-gradient-to-br from-white via-violet-100 to-pink-200 bg-clip-text text-transparent italic tracking-tight leading-snug text-glow">
            {joke.punchline}
          </p>
        </div>
      </div>

      <div className="absolute top-6 right-8 text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none opacity-50">
        Packet ID: {Math.random().toString(16).slice(2, 8)}
      </div>
    </div>
  );
};