import React, { useEffect, useState } from 'react';
import { Joke } from '../types.ts';

interface JokeCardProps {
  joke: Joke | null;
  loading: boolean;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke, loading }) => {
  const [showPunchline, setShowPunchline] = useState(false);
  const [loadingText, setLoadingText] = useState("Scanning humor matrix...");

  useEffect(() => {
    if (loading) {
      const phrases = [
        "Analyzing funny particles...",
        "Compiling punchlines...",
        "Debugging bad moods...",
        "Optimizing delivery...",
        "Consulting the giggle-bot..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(phrases[i % phrases.length]);
        i++;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (joke) {
      setShowPunchline(false);
      const timer = setTimeout(() => setShowPunchline(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [joke]);

  if (loading) {
    return (
      <div className="w-full max-w-xl min-h-[320px] flex flex-col items-center justify-center p-8 space-y-8 glass rounded-[2rem] glow-border">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-pink-500/20 border-b-pink-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
        </div>
        <p className="text-violet-300 font-display font-medium text-lg animate-pulse">{loadingText}</p>
      </div>
    );
  }

  if (!joke) {
    return (
      <div className="w-full max-w-xl min-h-[320px] flex flex-col items-center justify-center p-12 text-center glass rounded-[2rem] border-white/5 group">
        <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <span className="text-4xl">⚡</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to Glitch?</h2>
        <p className="text-slate-400 max-w-xs leading-relaxed">
          The AI is primed with high-voltage humor. Pick a vibe and let's go.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl p-8 md:p-12 glass rounded-[2.5rem] glow-border shadow-2xl relative overflow-hidden group">
      <div className="space-y-10 relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-4">
             <div className="h-[1px] w-8 bg-violet-500"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400">The Setup</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-white leading-snug">
            {joke.setup}
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-300 transform ${showPunchline ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-[1px] w-8 bg-pink-500"></div>
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-400">The Glitch</span>
          </div>
          <p className="text-xl md:text-3xl font-display font-bold bg-gradient-to-br from-white via-violet-200 to-pink-300 bg-clip-text text-transparent italic leading-tight">
            "{joke.punchline}"
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl select-none">✨</div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full group-hover:bg-violet-600/20 transition-colors"></div>
    </div>
  );
};