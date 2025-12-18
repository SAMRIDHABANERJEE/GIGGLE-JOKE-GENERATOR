import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
export interface Joke {
  setup: string;
  punchline: string;
}

export enum Vibe {
  CLEVER = 'clever',
  ABSURD = 'absurd',
  WHOLESOME = 'wholesome',
  WITTY = 'witty',
  SURPRISE = 'surprise'
}

export interface GeneratorState {
  joke: Joke | null;
  loading: boolean;
  error: string | null;
  vibe: Vibe;
  isFirstJoke: boolean;
}

// --- Service ---
const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  const apiKey = (window as any).process?.env?.API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING: Link to Neural Core failed.");

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "sharp-witted intellectual",
    [Vibe.ABSURD]: "surrealist philosopher",
    [Vibe.WHOLESOME]: "warm neighbor",
    [Vibe.WITTY]: "quick-fire comedian",
    [Vibe.SURPRISE]: "chaotic AI"
  };

  const selectedVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  const response = await ai.models.generateContent({
    model,
    contents: `Protocol: ${selectedVibe} humor request.`,
    config: {
      systemInstruction: `You are a ${personaMap[vibe]}. Generate a high-quality 2-line joke. Return JSON with 'setup' and 'punchline'.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          setup: { type: Type.STRING },
          punchline: { type: Type.STRING }
        },
        required: ["setup", "punchline"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty core response.");
  return JSON.parse(text) as Joke;
};

// --- Components ---

const VibeSelector: React.FC<{ currentVibe: Vibe; onVibeChange: (v: Vibe) => void }> = ({ currentVibe, onVibeChange }) => {
  const vibes = [
    { id: Vibe.CLEVER, label: 'Clever', emoji: '🧠', color: 'bg-indigo-500' },
    { id: Vibe.WITTY, label: 'Witty', emoji: '✨', color: 'bg-cyan-500' },
    { id: Vibe.ABSURD, label: 'Absurd', emoji: '🌀', color: 'bg-orange-500' },
    { id: Vibe.WHOLESOME, label: 'Warm', emoji: '❤️', color: 'bg-rose-500' },
    { id: Vibe.SURPRISE, label: 'Surprise', emoji: '🎲', color: 'bg-violet-600' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 px-4 py-6 mb-4">
      {vibes.map((v) => (
        <button
          key={v.id}
          onClick={() => onVibeChange(v.id)}
          className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            currentVibe === v.id
              ? `text-white scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)]`
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
          }`}
        >
          {currentVibe === v.id && (
            <div className={`absolute inset-0 ${v.color} rounded-full -z-10 animate-pulse opacity-20`}></div>
          )}
          <div className={`absolute inset-0 ${v.color} rounded-full -z-20 transition-opacity ${currentVibe === v.id ? 'opacity-100' : 'opacity-0'}`}></div>
          <span className="text-lg">{v.emoji}</span>
          <span>{v.label}</span>
        </button>
      ))}
    </div>
  );
};

const JokeCard: React.FC<{ joke: Joke | null; loading: boolean }> = ({ joke, loading }) => {
  const [reveal, setReveal] = useState(false);
  const [step, setStep] = useState(0);
  const steps = ["Injecting sarcasm...", "Verifying safety...", "Finalizing delivery..."];

  useEffect(() => {
    if (loading) {
      setReveal(false);
      const int = setInterval(() => setStep(s => (s + 1) % steps.length), 800);
      return () => clearInterval(int);
    }
  }, [loading]);

  useEffect(() => {
    if (joke) {
      const t = setTimeout(() => setReveal(true), 1200);
      return () => clearTimeout(t);
    }
  }, [joke]);

  if (loading) return (
    <div className="w-full max-w-2xl min-h-[350px] flex flex-col items-center justify-center p-10 glass rounded-[3rem] border-violet-500/20 shadow-2xl relative overflow-hidden">
      <div className="w-20 h-20 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-8"></div>
      <p className="font-mono text-violet-400 text-xs tracking-widest uppercase animate-pulse">{steps[step]}</p>
    </div>
  );

  if (!joke) return (
    <div className="w-full max-w-2xl min-h-[350px] flex flex-col items-center justify-center p-12 text-center glass rounded-[3rem] border-white/10">
      <div className="mb-6 text-5xl animate-bounce">✨</div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">Neural Ready.</h2>
      <p className="text-slate-400 max-w-xs mx-auto">Pick a frequency and initiate humor transmission.</p>
    </div>
  );

  return (
    <div className="w-full max-w-2xl p-10 md:p-16 glass rounded-[3rem] border-white/10 shadow-2xl relative group overflow-hidden">
      <div className="space-y-12 relative z-10">
        <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
          {joke.setup}
        </h3>
        <div className={`transition-all duration-1000 transform ${reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 blur-sm'}`}>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-6"></div>
          <p className="text-2xl md:text-4xl font-display font-black bg-gradient-to-br from-white via-violet-100 to-pink-200 bg-clip-text text-transparent italic tracking-tight leading-snug">
            {joke.punchline}
          </p>
        </div>
      </div>
      <div className="absolute top-6 right-8 font-mono text-[9px] text-slate-700 uppercase tracking-widest">LOG_ID: {Math.random().toString(16).slice(2,8)}</div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [state, setState] = useState<GeneratorState>({
    joke: null,
    loading: false,
    error: null,
    vibe: Vibe.SURPRISE,
    isFirstJoke: true
  });

  const fetchJoke = useCallback(async () => {
    setState(p => ({ ...p, loading: true, error: null }));
    try {
      const res = await generateJoke(state.vibe);
      setState(p => ({ ...p, joke: res, loading: false, isFirstJoke: false }));
    } catch (err: any) {
      setState(p => ({ ...p, loading: false, error: err.message }));
    }
  }, [state.vibe]);

  const copy = () => {
    if (!state.joke) return;
    navigator.clipboard.writeText(`${state.joke.setup}\n\n${state.joke.punchline}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-12 relative">
      <div className="fixed inset-0 -z-10 bg-[#020617]">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-violet-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="text-center mb-12 relative z-10">
        <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-4 tracking-tighter leading-none">
          Giggle<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Glitch</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light">Precision-engineered AI humor for your neural circuits.</p>
      </header>

      <main className="w-full flex flex-col items-center gap-8 relative z-10">
        <VibeSelector currentVibe={state.vibe} onVibeChange={(v) => setState(p => ({ ...p, vibe: v }))} />
        <JokeCard joke={state.joke} loading={state.loading} />

        {state.error && (
          <div className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
            {state.error}
          </div>
        )}

        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={fetchJoke}
            disabled={state.loading}
            className="flex-1 px-8 py-5 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {state.isFirstJoke ? 'Initialize' : 'Another Glitch'}
          </button>
          {state.joke && (
            <button onClick={copy} className="p-5 glass text-white rounded-full hover:bg-white/10 transition-all border-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            </button>
          )}
        </div>
      </main>

      <footer className="mt-20 opacity-30 text-[9px] font-mono tracking-[0.5em] text-white uppercase text-center">
        Neural Core 3.5.2 • Deploy Status: Online
      </footer>
    </div>
  );
};

// --- Boot ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
