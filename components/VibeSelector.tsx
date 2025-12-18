
import React from 'react';
import { Vibe } from '../types';

interface VibeSelectorProps {
  currentVibe: Vibe;
  onVibeChange: (vibe: Vibe) => void;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({ currentVibe, onVibeChange }) => {
  const vibes = [
    { id: Vibe.CLEVER, label: '🧠 Clever', color: 'from-blue-500 to-cyan-400' },
    { id: Vibe.WITTY, label: '✨ Witty', color: 'from-purple-500 to-indigo-400' },
    { id: Vibe.ABSURD, label: '🌀 Absurd', color: 'from-orange-500 to-yellow-400' },
    { id: Vibe.WHOLESOME, label: '❤️ Warm', color: 'from-pink-500 to-rose-400' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {vibes.map((v) => (
        <button
          key={v.id}
          onClick={() => onVibeChange(v.id)}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
            currentVibe === v.id
              ? `bg-gradient-to-r ${v.color} text-white border-transparent shadow-lg scale-105`
              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
};
