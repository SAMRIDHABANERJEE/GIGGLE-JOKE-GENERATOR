import React from 'react';
import { Vibe } from '../types.ts';

interface VibeSelectorProps {
  currentVibe: Vibe;
  onVibeChange: (vibe: Vibe) => void;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({ currentVibe, onVibeChange }) => {
  const vibes = [
    { id: Vibe.CLEVER, label: '🧠 Clever', color: 'from-violet-600 to-indigo-600' },
    { id: Vibe.WITTY, label: '✨ Witty', color: 'from-blue-600 to-cyan-600' },
    { id: Vibe.ABSURD, label: '🌀 Absurd', color: 'from-orange-600 to-amber-600' },
    { id: Vibe.WHOLESOME, label: '❤️ Warm', color: 'from-pink-600 to-rose-600' },
    { id: Vibe.SURPRISE, label: '🎲 Surprise', color: 'from-emerald-600 to-teal-600' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 px-4">
      {vibes.map((v) => (
        <button
          key={v.id}
          onClick={() => onVibeChange(v.id)}
          className={`relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
            currentVibe === v.id
              ? `text-white border-transparent shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105`
              : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
          }`}
        >
          {currentVibe === v.id && (
            <div className={`absolute inset-0 bg-gradient-to-br ${v.color} -z-10`} />
          )}
          <span className="relative z-10">{v.label}</span>
        </button>
      ))}
    </div>
  );
};