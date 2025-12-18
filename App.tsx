
import React, { useState, useCallback, useRef } from 'react';
import { generateJoke, generateJokeVisual, generateJokeSpeech, explainJoke } from './geminiService.ts';
import { Vibe, GeneratorState } from './types.ts';
import { JokeCard } from './components/JokeCard.tsx';
import { VibeSelector } from './components/VibeSelector.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<GeneratorState>({
    joke: null,
    loading: false,
    visualLoading: false,
    audioLoading: false,
    explaining: false,
    error: null,
    vibe: Vibe.SURPRISE,
    topic: '',
    isFirstJoke: true,
    imageUrl: null,
    audioBuffer: null
  });

  const [explanation, setExplanation] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const decodeAudio = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const playAudio = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  const fetchJoke = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, imageUrl: null, audioBuffer: null }));
    setExplanation(null);
    try {
      const newJoke = await generateJoke(state.vibe, state.topic);
      setState(prev => ({ ...prev, joke: newJoke, loading: false, isFirstJoke: false, visualLoading: true }));
      
      // Secondary intelligence: Generate Visual
      try {
        const visual = await generateJokeVisual(newJoke);
        setState(prev => ({ ...prev, imageUrl: visual, visualLoading: false }));
      } catch (e) {
        setState(prev => ({ ...prev, visualLoading: false }));
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [state.vibe, state.topic]);

  const handleAudio = async () => {
    if (!state.joke) return;
    if (state.audioBuffer) {
      playAudio(state.audioBuffer);
      return;
    }

    setState(prev => ({ ...prev, audioLoading: true }));
    try {
      const base64 = await generateJokeSpeech(`${state.joke.setup}. ${state.joke.punchline}`, state.vibe);
      const buffer = await decodeAudio(base64);
      setState(prev => ({ ...prev, audioLoading: false, audioBuffer: buffer }));
      playAudio(buffer);
    } catch (e) {
      setState(prev => ({ ...prev, audioLoading: false }));
    }
  };

  const handleExplain = async () => {
    if (!state.joke) return;
    setState(prev => ({ ...prev, explaining: true }));
    try {
      const text = await explainJoke(state.joke);
      setExplanation(text);
    } finally {
      setState(prev => ({ ...prev, explaining: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-12 relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vh] bg-violet-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/5 blur-[150px] rounded-full"></div>
      </div>

      <header className="text-center mb-16 animate-in fade-in duration-1000">
        <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-6 tracking-tighter select-none">
          Giggle<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400">Glitch</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light max-w-xl mx-auto opacity-80">
          Advanced Multimodal Neural Humor Matrix.
        </p>
      </header>

      <main className="w-full flex flex-col items-center gap-10 max-w-4xl z-10">
        <div className="w-full max-w-md space-y-4">
          <VibeSelector currentVibe={state.vibe} onVibeChange={(v) => setState(p => ({...p, vibe: v}))} />
          
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Inject Neural Topic (e.g. quantum physics, cats, coding)"
              className="w-full px-8 py-5 glass rounded-full text-white placeholder:text-slate-600 outline-none border border-white/10 focus:border-violet-500/50 transition-all text-sm font-mono tracking-tight"
              value={state.topic}
              onChange={(e) => setState(p => ({...p, topic: e.target.value}))}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-700 uppercase tracking-widest hidden group-focus-within:block animate-pulse">Probe Active</div>
          </div>
        </div>

        <JokeCard 
          joke={state.joke} 
          loading={state.loading} 
          imageUrl={state.imageUrl}
          visualLoading={state.visualLoading}
          onAudioRequest={handleAudio}
          audioLoading={state.audioLoading}
          onExplainRequest={handleExplain}
          explaining={state.explaining}
          explanation={explanation}
        />

        {state.error && <div className="text-red-400 font-mono text-xs uppercase tracking-widest animate-bounce">⚠ {state.error}</div>}

        <button
          onClick={fetchJoke}
          disabled={state.loading}
          className="group relative px-12 py-6 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-2xl disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-pink-200 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></div>
          <span className="uppercase tracking-[0.4em] text-[10px] relative z-10">
            {state.isFirstJoke ? 'Initialize Humor' : 'Regenerate Matrix'}
          </span>
        </button>
      </main>

      <footer className="mt-24 text-[8px] font-mono text-slate-800 uppercase tracking-[0.8em] text-center">
        Multimodal Neural Core v4.0.0 • Powered by Gemini AI
      </footer>
    </div>
  );
};

export default App;
