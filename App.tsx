
import React, { useState, useEffect } from 'react';
import { AppMode } from './types.ts';
import JokeLab from './components/JokeLab.tsx';
import NeuralStudio from './components/NeuralStudio.tsx';
import GlobalChat from './components/GlobalChat.tsx';
import LiveSync from './components/LiveSync.tsx';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('JOKE_LAB');

  useEffect(() => {
    // Reveal app
    const loader = document.getElementById('boot-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, []);

  const navItems = [
    { id: 'JOKE_LAB', label: 'Joke Lab', icon: '🎭' },
    { id: 'NEURAL_STUDIO', label: 'Studio', icon: '🎨' },
    { id: 'GLOBAL_CHAT', label: 'Chat', icon: '💬' },
    { id: 'LIVE_SYNC', label: 'Live', icon: '🎙️' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vh] bg-violet-600/5 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-pink-600/5 blur-[150px] rounded-full [animation-delay:2s]"></div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="w-full md:w-24 bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-around md:justify-center gap-8 py-6 z-50">
        <div className="hidden md:block mb-12 text-2xl font-black italic text-violet-500">G.G</div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as AppMode)}
            className={`flex flex-col items-center gap-1 group transition-all ${mode === item.id ? 'text-violet-400 scale-110' : 'text-slate-500 hover:text-white'}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[10px] uppercase font-bold tracking-tighter">{item.label}</span>
            {mode === item.id && <div className="w-1 h-1 bg-violet-400 rounded-full mt-1 animate-ping"></div>}
          </button>
        ))}
      </nav>

      {/* Main Stage */}
      <main className="flex-1 relative overflow-y-auto p-4 md:p-12">
        <div className="max-w-6xl mx-auto h-full">
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
