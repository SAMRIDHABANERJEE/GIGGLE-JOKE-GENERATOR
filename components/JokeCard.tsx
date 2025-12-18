
import React, { useEffect, useState, useRef } from 'react';
import { Joke, Vibe } from '../types.ts';

interface JokeCardProps {
  joke: Joke | null;
  loading: boolean;
  imageUrl: string | null;
  visualLoading: boolean;
  onAudioRequest: () => void;
  audioLoading: boolean;
  onExplainRequest: () => void;
  explaining: boolean;
  explanation: string | null;
}

export const JokeCard: React.FC<JokeCardProps> = ({ 
  joke, loading, imageUrl, visualLoading, onAudioRequest, audioLoading, onExplainRequest, explaining, explanation 
}) => {
  const [revealPunchline, setRevealPunchline] = useState(false);

  useEffect(() => {
    if (loading) {
      setRevealPunchline(false);
    }
  }, [loading]);

  useEffect(() => {
    if (joke) {
      const timer = setTimeout(() => setRevealPunchline(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [joke]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center p-10 glass rounded-[3rem] border-violet-500/20 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6"></div>
        <p className="font-mono text-violet-400 text-xs tracking-widest uppercase animate-pulse">Syncing Humor frequency...</p>
      </div>
    );
  }

  if (!joke) {
    return (
      <div className="w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center p-12 text-center glass rounded-[3rem] border-white/10 group">
        <div className="mb-8 text-6xl opacity-30 group-hover:opacity-60 transition-opacity">⚡</div>
        <h2 className="text-3xl font-display font-black text-white mb-2 uppercase tracking-tighter">System Idle</h2>
        <p className="text-slate-500 text-sm">Waiting for neural command...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl glass rounded-[3rem] border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
      {/* Visual Component */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden border-b border-white/5">
        {visualLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
             <div className="flex gap-1">
               <div className="w-1 h-8 bg-violet-500 animate-[bounce_1s_infinite_0s]"></div>
               <div className="w-1 h-8 bg-violet-400 animate-[bounce_1s_infinite_0.1s]"></div>
               <div className="w-1 h-8 bg-violet-500 animate-[bounce_1s_infinite_0.2s]"></div>
             </div>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Joke Visual" className="w-full h-full object-cover animate-in fade-in duration-1000" />
        ) : (
          <div className="text-slate-700 font-mono text-[10px] uppercase tracking-widest">Visual Matrix Disconnected</div>
        )}
      </div>

      <div className="p-10 md:p-14 space-y-10 relative">
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
            {joke.setup}
          </h3>
          
          <div className={`transition-all duration-1000 transform ${revealPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 blur-sm'}`}>
            <p className="text-2xl md:text-4xl font-display font-black bg-gradient-to-br from-white via-violet-200 to-pink-200 bg-clip-text text-transparent italic leading-tight">
              {joke.punchline}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button 
            onClick={onAudioRequest}
            disabled={audioLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest hover:bg-violet-500/20 transition-all disabled:opacity-50"
          >
            {audioLoading ? 'Vocalizing...' : 'Neural Audio'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>

          <button 
            onClick={onExplainRequest}
            disabled={explaining}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all disabled:opacity-50"
          >
            {explaining ? 'Analyzing...' : 'Deconstruct'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </button>
        </div>

        {explanation && (
          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
            <p className="text-xs text-slate-400 font-mono leading-relaxed italic">
              <span className="text-cyan-400 font-bold mr-2 uppercase">Neural Logic:</span>
              {explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
