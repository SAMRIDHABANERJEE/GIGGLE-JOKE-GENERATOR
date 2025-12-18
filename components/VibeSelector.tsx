import React from 'react';
import { Vibe } from '../types.ts';

interface VibeSelectorProps {
  currentVibe: Vibe;
  onVibeChange: (vibe: Vibe) => void;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({ currentVibe, onVibeChange }) => {
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