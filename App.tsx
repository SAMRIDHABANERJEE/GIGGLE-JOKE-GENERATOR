
import React, { useState, useCallback } from 'react';
import { generateJoke } from './geminiService';
import { Vibe, GeneratorState } from './types';
import { JokeCard } from './components/JokeCard';
import { VibeSelector } from './components/VibeSelector';

const App: React.FC = () => {
  const [state, setState] = useState<GeneratorState>({
    joke: null,
    loading: false,
    error: null,
    vibe: Vibe.SURPRISE,
    isFirstJoke: true
  });

  const fetchJoke = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newJoke = await generateJoke(state.vibe);
      setState(prev => ({ 
        ...prev, 
        joke: newJoke, 
        loading: false, 
        isFirstJoke: false 
      }));
    } catch (err: any) {
      // API Key errors will now simply be displayed as general errors.
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [state.vibe]);

  const setVibe = (newVibe: Vibe) => {
    setState(prev => ({ ...prev, vibe: newVibe }));
  };

  const copyToClipboard = () => {
    if (!state.joke) return;
    const text = `${state.joke.setup}\n\n${state.joke.punchline}\n\n— Via GiggleGlitch AI`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] bg-violet-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-pink-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vh] bg-cyan-600/5 blur-[100px] rounded-full animate-bounce [animation-duration:10s]"></div>
      </div>

      <header className="w-full max-w-4xl flex flex-col items-center text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-bold tracking-[0.3em] uppercase mb-8 animate-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Neural Engine Stable
        </div>

        <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-6 tracking-tighter leading-none select-none">
          Giggle<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400">Glitch</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
          The high-frequency neural generator for sharp, unexpected humor. 
          Select your frequency and initialize.
        </p>
      </header>

      <main className="w-full flex flex-col items-center gap-10 relative z-10">
        <VibeSelector currentVibe={state.vibe} onVibeChange={setVibe} />

        <JokeCard joke={state.joke} loading={state.loading} />

        {state.error && (
          <div className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-mono flex items-center gap-3 animate-bounce">
            <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
            {state.error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm px-4">
          <button
            onClick={fetchJoke}
            disabled={state.loading}
            className="w-full group relative px-10 py-5 bg-white text-slate-950 font-black rounded-full hover:scale-[1.03] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100 overflow-hidden shadow-[0_20px_50px_rgba(139,92,246,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-200/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center justify-center gap-3 relative z-10">
              {state.loading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-700">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              )}
              <span className="uppercase tracking-[0.2em] text-xs">
                {state.isFirstJoke ? 'Initialize Humor' : 'Execute Another'}
              </span>
            </div>
          </button>

          {state.joke && !state.loading && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 p-5 glass text-white rounded-full hover:bg-white/10 active:scale-90 transition-all border-white/10"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              </svg>
            </button>
          )}
        </div>
      </main>

      <footer className="mt-24 mb-8 text-slate-600 font-mono text-[9px] uppercase tracking-[0.5em] flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-[1px] bg-slate-800"></div>
        <div>
          Neural Core 3.5.2 • Enhanced with Gemini Pro
        </div>
        <div className="opacity-40 max-w-xs leading-loose tracking-widest px-8">
          Warning: Prolonged exposure to high-frequency humor may cause involuntary laughter loops.
        </div>
      </footer>
    </div>
  );
};

export default App;
