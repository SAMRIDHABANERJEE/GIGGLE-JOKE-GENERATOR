
import React, { useState, useEffect, useCallback } from 'react';
import { AppMode } from './types.ts';
import JokeLab from './components/JokeLab.tsx';
import NeuralStudio from './components/NeuralStudio.tsx';
import GlobalChat from './components/GlobalChat.tsx';
import LiveSync from './components/LiveSync.tsx';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('JOKE_LAB');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initial system check
    const boot = async () => {
      // Small delay for aesthetics
      await new Promise(r => setTimeout(r, 1000));
      setIsReady(true);
    };
    boot();
  }, []);

  const openKeySelector = async () => {
    try {
      await window.aistudio.openSelectKey();
    } catch (e) {
      console.warn("AI Studio bridge unavailable.");
    }
  };

  const navItems = [
    { id: 'JOKE_LAB', label: 'Joke Lab', icon: '🎭' },
    { id: 'NEURAL_STUDIO', label: 'Studio', icon: '🎨' },
    { id: 'GLOBAL_CHAT', label: 'Intelligence', icon: '💬' },
    { id: 'LIVE_SYNC', label: 'Live Sync', icon: '🎙️' },
  ];

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <div className="w-24 h-24 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-8"></div>
        <h1 className="text-2xl font-display font-black tracking-widest uppercase animate-pulse">Initializing Neural Core</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vh] bg-violet-600/5 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/5 blur-[150px] rounded-full [animation-delay:2s]"></div>
      </div>

      {/* Modern Sidebar */}
      <nav className="w-full md:w-28 bg-slate-900/40 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-around md:justify-center gap-10 py-8 z-50">
        <div className="hidden md:flex flex-col items-center mb-auto">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-2">
            <span className="text-xl font-black italic">G</span>
          </div>
          <div className="h-20 w-[1px] bg-gradient-to-b from-white/10 to-transparent"></div>
        </div>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as AppMode)}
            className={`flex flex-col items-center gap-2 group transition-all duration-500 ${mode === item.id ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${mode === item.id ? 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10' : 'bg-transparent'}`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span className="text-[9px] uppercase font-black tracking-widest opacity-60">{item.label}</span>
          </button>
        ))}

        <div className="hidden md:flex flex-col items-center mt-auto">
          <button 
            onClick={openKeySelector}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/30 transition-all"
            title="Switch Neural Key"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5l-2.293-2.293a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 0L17.5 5.5"></path></svg>
          </button>
        </div>
      </nav>

      {/* Main Experience Stage */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-full flex flex-col">
          {mode === 'JOKE_LAB' && <JokeLab />}
          {mode === 'NEURAL_STUDIO' && <NeuralStudio />}
          {mode === 'GLOBAL_CHAT' && <GlobalChat />}
          {mode === 'LIVE_SYNC' && <LiveSync />}
          
          <footer className="mt-auto pt-24 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 opacity-30 select-none">
            <div className="flex items-center gap-4 text-[9px] font-mono tracking-widest uppercase">
              <span>Core v5.2.1</span>
              <span className="w-1 h-1 rounded-full bg-violet-500"></span>
              <span>Gemini 3.0 Ready</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest uppercase">
              Neural Network Operational
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
