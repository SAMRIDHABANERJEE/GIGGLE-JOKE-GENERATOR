
import React, { useState, useEffect } from 'react';
import { AppMode } from './types.ts';
import JokeLab from './components/JokeLab.tsx';
import NeuralStudio from './components/NeuralStudio.tsx';
import GlobalChat from './components/GlobalChat.tsx';
import LiveSync from './components/LiveSync.tsx';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('JOKE_LAB');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Neural Boot Sequence
    const init = async () => {
      await new Promise(r => setTimeout(r, 800));
      setIsReady(true);
    };
    init();
  }, []);

  const openKeySelector = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
    } else {
      console.warn("AI Studio Key Bridge not detected.");
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-violet-400">G.G</div>
        </div>
        <h1 className="mt-8 text-sm font-mono tracking-[0.5em] text-slate-500 uppercase animate-pulse">Neural Synchronization...</h1>
      </div>
    );
  }

  const navItems = [
    { id: 'JOKE_LAB', label: 'Neural Lab', icon: '🎭' },
    { id: 'NEURAL_STUDIO', label: 'Forge', icon: '🎨' },
    { id: 'GLOBAL_CHAT', label: 'Intelligence', icon: '💬' },
    { id: 'LIVE_SYNC', label: 'Real-time', icon: '🎙️' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vh] bg-violet-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Glass Sidebar */}
      <nav className="w-full md:w-28 bg-slate-900/40 backdrop-blur-3xl border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-around md:justify-center gap-10 py-8 z-50">
        <div className="hidden md:flex flex-col items-center mb-auto">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-2">
            <span className="text-xl font-black italic text-violet-400">G</span>
          </div>
          <div className="h-16 w-[1px] bg-gradient-to-b from-white/10 to-transparent"></div>
        </div>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as AppMode)}
            className={`flex flex-col items-center gap-2 group transition-all duration-300 ${mode === item.id ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${mode === item.id ? 'bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/5'}`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span className="text-[8px] uppercase font-black tracking-widest">{item.label}</span>
          </button>
        ))}

        <div className="hidden md:flex flex-col items-center mt-auto">
           <button 
             onClick={openKeySelector}
             className="p-3 rounded-full border border-white/5 text-slate-500 hover:bg-white/5 transition-all"
             title="Switch API Key"
           >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5l-2.293-2.293a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 0L17.5 5.5"></path></svg>
           </button>
        </div>
      </nav>

      {/* Main Experience */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-full">
          {mode === 'JOKE_LAB' && <JokeLab />}
          {mode === 'NEURAL_STUDIO' && <NeuralStudio />}
          {mode === 'GLOBAL_CHAT' && <GlobalChat />}
          {mode === 'LIVE_SYNC' && <LiveSync />}
        </div>
      </main>
    </div>
  );
};

export default App;
