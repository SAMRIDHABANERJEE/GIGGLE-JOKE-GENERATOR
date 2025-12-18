
import React, { useState } from 'react';
import { Vibe, Joke } from '../types.ts';
import { generateJoke, generateJokeVisual, editImage } from '../geminiService.ts';
import { VibeSelector } from './VibeSelector.tsx';

const JokeLab: React.FC = () => {
  const [vibe, setVibe] = useState(Vibe.CLEVER);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editing, setEditing] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const res = await generateJoke(vibe, '');
      setJoke(res);
      const img = await generateJokeVisual(res);
      setImage(img);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!image || !editPrompt) return;
    setEditing(true);
    try {
      const edited = await editImage(image, editPrompt);
      setImage(edited);
      setEditPrompt('');
    } catch (e) { console.error(e); }
    setEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col items-center text-center">
        <h2 className="text-5xl font-display font-black mb-4">Neural <span className="text-violet-500">Joke Lab</span></h2>
        <VibeSelector currentVibe={vibe} onVibeChange={setVibe} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="glass rounded-[3rem] p-10 space-y-8 border-white/5 shadow-2xl">
          {joke ? (
            <div className="space-y-6">
              <p className="text-2xl font-bold text-slate-300 leading-relaxed italic">"{joke.setup}"</p>
              <p className="text-4xl font-black text-white leading-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                {joke.punchline}
              </p>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center opacity-20 italic">Initialize humor sequence...</div>
          )}

          <button
            onClick={fetchJoke}
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-xl uppercase text-[10px] tracking-widest disabled:opacity-50"
          >
            {loading ? 'Synthesizing...' : 'Generate New Joke'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="aspect-video glass rounded-[2.5rem] overflow-hidden relative border-white/5 shadow-inner">
            {image ? (
              <img src={image} className="w-full h-full object-cover" alt="Joke visual" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700 font-mono text-[10px] uppercase">No Visual Projection</div>
            )}
            {editing && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">Editing Image...</div>}
          </div>

          {image && (
            <div className="flex gap-2 p-2 glass rounded-full border-white/5">
              <input
                className="flex-1 bg-transparent px-6 text-sm outline-none"
                placeholder="Edit: 'Add retro filter', 'Make it neon'..."
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
              />
              <button
                onClick={handleEdit}
                disabled={editing || !editPrompt}
                className="px-6 py-3 bg-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JokeLab;
