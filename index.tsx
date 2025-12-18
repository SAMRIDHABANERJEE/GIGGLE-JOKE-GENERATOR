import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types & Enums ---
enum Vibe {
  CLEVER = 'clever',
  ABSURD = 'absurd',
  WHOLESOME = 'wholesome',
  WITTY = 'witty',
  SURPRISE = 'surprise'
}

interface Joke {
  setup: string;
  punchline: string;
}

// --- AI Service ---
const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  const apiKey = (window as any).process?.env?.API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING: The humor core needs an identity key.");

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "a sharp-witted intellectual with dry humor",
    [Vibe.ABSURD]: "a surrealist who speaks in weird metaphors",
    [Vibe.WHOLESOME]: "a warm, kind mentor making people smile",
    [Vibe.WITTY]: "a fast-talking stand-up comedian",
    [Vibe.SURPRISE]: "a chaotic humor algorithm"
  };

  const selectedVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Request: ${selectedVibe} joke.`,
      config: {
        systemInstruction: `You are ${personaMap[vibe]}. Generate a high-quality 2-line joke. Format: JSON with 'setup' and 'punchline'.`,
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
    if (!text) throw new Error("Null frequency response.");
    return JSON.parse(text) as Joke;
  } catch (error) {
    console.error("Neural Error:", error);
    throw new Error("Humor matrix unstable. Please recalibrate.");
  }
};

// --- Components ---

const VibeSelector: React.FC<{ current: Vibe; onChange: (v: Vibe) => void }> = ({ current, onChange }) => {
  const options = [
    { id: Vibe.CLEVER, label: 'Clever', emoji: '🧠', color: 'bg-indigo-500' },
    { id: Vibe.WITTY, label: 'Witty', emoji: '✨', color: 'bg-cyan-500' },
    { id: Vibe.ABSURD, label: 'Absurd', emoji: '🌀', color: 'bg-orange-500' },
    { id: Vibe.WHOLESOME, label: 'Warm', emoji: '❤️', color: 'bg-rose-500' },
    { id: Vibe.SURPRISE, label: 'Surprise', emoji: '🎲', color: 'bg-violet-600' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 px-4 py-6">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            current === opt.id
              ? `text-white scale-105 shadow-xl`
              : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
          }`}
        >
          {current === opt.id && (
            <div className={`absolute inset-0 ${opt.color} rounded-full -z-10 animate-pulse opacity-40`}></div>
          )}
          {current === opt.id && (
            <div className={`absolute inset-0 ${opt.color} rounded-full -z-20`}></div>
          )}
          <span>{opt.emoji}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

const JokeCard: React.FC<{ joke: Joke | null; loading: boolean }> = ({ joke, loading }) => {
  const [showPunchline, setShowPunchline] = useState(false);
  const [step, setStep] = useState(0);
  const loadingSteps = ["Verifying sarcasm...", "Syncing laugh tracks...", "Injecting wit..."];

  useEffect(() => {
    if (loading) {
      setShowPunchline(false);
      const interval = setInterval(() => setStep(s => (s + 1) % loadingSteps.length), 800);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (joke) {
      const timer = setTimeout(() => setShowPunchline(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [joke]);

  if (loading) return (
    <div className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-12 glass rounded-[3rem] border-violet-500/20 shadow-2xl">
      <div className="w-16 h-16 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6"></div>
      <p className="font-mono text-violet-400 text-xs tracking-[0.3em] uppercase animate-pulse">{loadingSteps[step]}</p>
    </div>
  );

  if (!joke) return (
    <div className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-12 text-center glass rounded-[3rem] border-white/10">
      <div className="text-5xl mb-6 opacity-50">⚡</div>
      <h2 className="text-3xl font-display font-bold text-white mb-2">Matrix Idle.</h2>
      <p className="text-slate-400 max-w-xs mx-auto">Select a frequency and initialize humor transmission.</p>
    </div>
  );

  return (
    <div className="w-full max-w-2xl p-12 md:p-16 glass rounded-[3rem] border-white/10 shadow-2xl relative group overflow-hidden transition-all hover:border-violet-500/30">
      <div className="space-y-12">
        <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
          {joke.setup}
        </h3>
        <div className={`transition-all duration-1000 transform ${showPunchline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 blur-sm'}`}>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mb-8"></div>
          <p className="text-2xl md:text-4xl font-display font-black bg-gradient-to-br from-white to-violet-300 bg-clip-text text-transparent tracking-tight leading-snug">
            {joke.punchline}
          </p>
        </div>
      </div>
      <div className="absolute top-6 right-8 font-mono text-[9px] text-slate-700 uppercase tracking-widest">LOG_ID: {Math.random().toString(16).slice(2,8)}</div>
    </div>
  );
};

// --- App Root ---

const App: React.FC = () => {
  const [vibe, setVibe] = useState(Vibe.SURPRISE);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateJoke(vibe);
      setJoke(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (joke) navigator.clipboard.writeText(`${joke.setup}\n\n${joke.punchline}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="fixed inset-0 -z-10 bg-[#020617]">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-violet-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <header className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-4 tracking-tighter leading-none select-none">
          Giggle<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Glitch</span>
        </h1>
        <p className="text-slate-400 text-lg font-light tracking-wide">Neural-optimized humor for sophisticated humans.</p>
      </header>

      <main className="w-full flex flex-col items-center gap-10">
        <VibeSelector current={vibe} onChange={setVibe} />
        
        <JokeCard joke={joke} loading={loading} />

        {error && (
          <div className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-mono">
            ⚠ {error}
          </div>
        )}

        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={fetchJoke}
            disabled={loading}
            className="flex-1 px-8 py-5 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
          >
            {joke ? 'Regenerate' : 'Initialize'}
          </button>
          {joke && (
            <button onClick={copy} className="p-5 glass text-white rounded-full hover:bg-white/10 transition-all border-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            </button>
          )}
        </div>
      </main>

      <footer className="mt-20 opacity-30 text-[9px] font-mono tracking-[0.5em] text-white uppercase text-center">
        Neural Core v3.5.2 • System: Stable
      </footer>
    </div>
  );
};

// --- Boot ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
