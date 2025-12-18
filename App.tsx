
import React, { useState, useCallback } from 'react';
import { generateJoke } from './geminiService';
import { Joke, Vibe, GeneratorState } from './types';
import { JokeCard } from './components/JokeCard';
import { VibeSelector } from './components/VibeSelector';

const App: React.FC = () => {
  const [state, setState] = useState<GeneratorState>({
    joke: null,
    loading: false,
    error: null,
    vibe: Vibe.CLEVER
  });

  const fetchJoke = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newJoke = await generateJoke(state.vibe);
      setState(prev => ({ ...prev, joke: newJoke, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [state.vibe]);

  const setVibe = (newVibe: Vibe) => {
    setState(prev => ({ ...prev, vibe: newVibe }));
  };

  const copyToClipboard = () => {
    if (state.joke) {
      const text = `${state.joke.setup}\n\n${state.joke.punchline}`;
      navigator.clipboard.writeText(text);
      alert('Joke copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          AI Powered Happiness
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-4 tracking-tight glow-text">
          Giggle<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Glitch</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          Uplifting, clever, and absurd 2-line jokes to debug your bad mood.
        </p>
      </header>

      <main className="w-full flex flex-col items-center space-y-12 relative z-10">
        <VibeSelector currentVibe={state.vibe} onVibeChange={setVibe} />

        <JokeCard joke={state.joke} loading={state.loading} />

        {state.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-sm text-center">
            {state.error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={fetchJoke}
            disabled={state.loading}
            className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${state.loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
            </svg>
            {state.joke ? 'Generate Another' : 'Get My First Joke'}
          </button>

          {state.joke && !state.loading && (
            <button
              onClick={copyToClipboard}
              className="px-6 py-4 glass text-white rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Share
            </button>
          )}
        </div>
      </main>

      <footer className="mt-20 text-slate-500 text-xs font-medium tracking-widest uppercase relative z-10">
        Powered by Gemini 3 Flash • Built for Smiles
      </footer>
    </div>
  );
};

export default App;
