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
  // Use the mandatory API key access pattern
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "a sharp-witted intellectual with dry humor",
    [Vibe.ABSURD]: "a surrealist who speaks in weird metaphors",
    [Vibe.WHOLESOME]: "a warm, kind person making people smile",
    [Vibe.WITTY]: "a fast-talking stand-up comedian",
    [Vibe.SURPRISE]: "a chaotic humor algorithm"
  };

  const selectedVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Protocol: ${selectedVibe} joke request.`,
      config: {
        systemInstruction: `You are ${personaMap[vibe]}. Generate a high-quality 2-line joke. Return strictly JSON with 'setup' and 'punchline' keys.`,
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
    if (!text) throw new Error("Null matrix response.");
    return JSON.parse(text) as Joke;
  } catch (error: any) {
    console.error("Neural Error:", error);
    throw new Error(error.message?.includes("API key") 
      ? "API_KEY_AUTH_FAILED: Check environment variables." 
      : "HUMOR_MATRIX_UNSTABLE: Please re-synchronize.");
  }
};

// --- App Root ---
const App: React.FC = () => {
  const [vibe, setVibe] = useState(Vibe.CLEVER);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);

  const vibes = [
    { id: Vibe.CLEVER, label: 'Clever', emoji: '🧠', color: 'bg-indigo-600' },
    { id: Vibe.WITTY, label: 'Witty', emoji: '✨', color: 'bg-cyan-600' },
    { id: Vibe.ABSURD, label: 'Absurd', emoji: '🌀', color: 'bg-orange-600' },
    { id: Vibe.WHOLESOME, label: 'Warm', emoji: '❤️', color: 'bg-rose-600' },
    { id: Vibe.SURPRISE, label: 'Surprise', emoji: '🎲', color: 'bg-violet-600' },
  ];

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    setReveal(false);
    try {
      const result = await generateJoke(vibe);
      setJoke(result);
      // Cinematic reveal delay
      setTimeout(() => setReveal(true), 1200);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (joke) {
      navigator.clipboard.writeText(`${joke.setup}\n\n${joke.punchline}\n\n— via GiggleGlitch`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] bg-violet-600/10 blur-[140px] rounded-full animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/10 blur-[140px] rounded-full animate-blob [animation-delay:2s]"></div>
      </div>

      <header className="text-center mb-12 animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-bold tracking-[0.4em] uppercase mb-10 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Neural Engine Operational
        </div>
        <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-6 tracking-tighter leading-none select-none drop-shadow-2xl">
          Giggle<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400">Glitch</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed opacity-80">
          Precision-engineered humor for sophisticated biological units.
        </p>
      </header>

      <main className="w-full flex flex-col items-center gap-10 max-w-4xl z-10">
        <div className="flex flex-wrap justify-center gap-3">
          {vibes.map((v) => (
            <button
              key={v.id}
              onClick={() => setVibe(v.id as Vibe)}
              className={`relative group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                vibe === v.id ? 'text-white scale-105 shadow-2xl' : 'text-slate-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              {vibe === v.id && <div className={`absolute inset-0 ${v.color} rounded-full -z-10 opacity-40 animate-pulse`}></div>}
              {vibe === v.id && <div className={`absolute inset-0 ${v.color} rounded-full -z-20 shadow-[0_0_40px_rgba(139,92,246,0.3)]`}></div>}
              <span className="text-xl leading-none group-hover:rotate-12 transition-transform">{v.emoji}</span>
              <span className="uppercase text-[10px] tracking-[0.2em] font-black">{v.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-12 glass rounded-[3.5rem] border-violet-500/20 shadow-2xl">
            <div className="w-20 h-20 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-8"></div>
            <p className="font-mono text-violet-400 text-xs tracking-[0.5em] uppercase animate-pulse">Syncing Laugh Track...</p>
          </div>
        ) : joke ? (
          <div className="w-full max-w-2xl p-12 md:p-20 glass rounded-[4rem] border-white/10 shadow-2xl relative transition-all duration-700 hover:border-violet-500/30 group">
            <div className="space-y-16">
              <h3 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
                {joke.setup}
              </h3>
              <div className={`transition-all duration-1000 transform ${reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 blur-md'}`}>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mb-12"></div>
                <p className="text-3xl md:text-5xl font-display font-black bg-gradient-to-br from-white to-violet-300 bg-clip-text text-transparent italic leading-snug drop-shadow-lg">
                  {joke.punchline}
                </p>
              </div>
            </div>
            <div className="absolute top-8 right-12 font-mono text-[9px] text-slate-800 uppercase tracking-widest pointer-events-none">SYNC_0x{Math.random().toString(16).slice(2,8)}</div>
          </div>
        ) : (
          <div className="w-full max-w-2xl min-h-[300px] flex flex-col items-center justify-center p-12 text-center glass rounded-[3.5rem] border-white/10 opacity-30 select-none">
            <div className="text-7xl mb-8 animate-bounce">⚡</div>
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Neural Core Idle</h2>
          </div>
        )}

        {error && (
          <div className="px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md px-4">
          <button
            onClick={fetchJoke}
            disabled={loading}
            className="flex-1 group relative px-10 py-6 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_60px_rgba(139,92,246,0.3)] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-200/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-center justify-center gap-4 relative z-10 tracking-[0.3em] uppercase text-[10px]">
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-180 transition-transform duration-1000">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              )}
              {joke ? 'Initialize Next' : 'Launch Humor'}
            </div>
          </button>
          
          {joke && (
            <button onClick={copy} className="px-8 py-6 glass text-white rounded-full hover:bg-white/10 transition-all active:scale-90 border-white/10 shadow-xl flex items-center justify-center group" title="Copy to clipboard">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </button>
          )}
        </div>
      </main>

      <footer className="mt-24 mb-12 opacity-30 text-[9px] font-mono tracking-[0.6em] text-white uppercase text-center select-none">
        Neural Humor Matrix v3.5.2 • System Secure
      </footer>
    </div>
  );
};

// --- Boot ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
