
import React, { useEffect, useState } from 'react';
import { Joke } from '../types';

interface JokeCardProps {
  joke: Joke | null;
  loading: boolean;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke, loading }) => {
  const [showPunchline, setShowPunchline] = useState(false);

  useEffect(() => {
    if (joke) {
      setShowPunchline(false);
      const timer = setTimeout(() => setShowPunchline(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [joke]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-8 space-y-6">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-purple-300 font-medium animate-pulse">Polishing the punchlines...</p>
      </div>
    );
  }

  if (!joke) {
    return (
      <div className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-8 text-center glass rounded-3xl border-purple-500/20">
        <h2 className="text-2xl font-display font-bold text-white mb-4">Feeling Tensed?</h2>
        <p className="text-slate-400">Click the magic button below to release some endorphins.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-10 glass rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 opacity-50"></div>
      
      <div className="space-y-12 relative z-10">
        <div className="animate-fade-in transition-all duration-700">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">The Setup</span>
          <h2 className="text-2xl md:text-4xl font-display font-medium text-white leading-tight">
            "{joke.setup}"
          </h2>
        </div>

        <div className={`transition-all duration-1000 transform ${showPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400 mb-4 block">The Payoff</span>
          <p className="text-xl md:text-3xl font-display font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent italic">
            {joke.punchline}
          </p>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/10 blur-3xl rounded-full group-hover:bg-purple-600/20 transition-all duration-700"></div>
    </div>
  );
};
