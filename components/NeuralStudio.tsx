
import React, { useState } from 'react';
import { generateProImage, generateVeoVideo } from '../geminiService.ts';
import { ImageConfig } from '../types.ts';

const NeuralStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imgConfig, setImgConfig] = useState<ImageConfig>({ size: '1K', aspectRatio: '1:1' });
  const [output, setOutput] = useState<{ type: 'img' | 'vid', url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState<string | null>(null);

  const checkKey = async () => {
    if (!await window.aistudio.hasSelectedApiKey()) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleGenerateImg = async () => {
    if (!prompt) return;
    // Fix: Users MUST select their own API key for gemini-3-pro-image-preview as per guidelines.
    await checkKey();
    setLoading(true);
    try {
      const url = await generateProImage(prompt, imgConfig);
      setOutput({ type: 'img', url });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleGenerateVid = async () => {
    if (!prompt && !upload) return;
    await checkKey();
    setLoading(true);
    try {
      const url = await generateVeoVideo(prompt, upload || undefined);
      setOutput({ type: 'vid', url });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUpload(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="text-center">
        <h2 className="text-5xl font-display font-black mb-2 tracking-tighter uppercase">Neural <span className="text-pink-500">Studio</span></h2>
        <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">High-Fidelity Generation Suite</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass p-8 rounded-[3rem] border-white/5 space-y-6">
          <textarea
            className="w-full bg-slate-950/50 p-8 rounded-[2rem] text-xl border border-white/10 outline-none focus:border-pink-500/50 transition-all min-h-[150px]"
            placeholder="Describe your vision..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <select 
                className="bg-slate-900 border border-white/10 p-3 rounded-xl text-xs"
                value={imgConfig.size}
                onChange={e => setImgConfig({...imgConfig, size: e.target.value as any})}
              >
                {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s} Res</option>)}
              </select>
              <select 
                className="bg-slate-900 border border-white/10 p-3 rounded-xl text-xs"
                value={imgConfig.aspectRatio}
                onChange={e => setImgConfig({...imgConfig, aspectRatio: e.target.value as any})}
              >
                {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4">
              <label className="cursor-pointer px-6 py-4 glass hover:bg-white/10 transition-colors rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span>{upload ? 'Change Ref' : 'Add Ref Image'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                {upload && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </label>
              
              <button 
                onClick={handleGenerateImg} 
                disabled={loading || !prompt}
                className="px-10 py-4 bg-pink-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                Gen Pro Image
              </button>
              <button 
                onClick={handleGenerateVid} 
                disabled={loading}
                className="px-10 py-4 bg-violet-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
              >
                Gen Veo Video
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-[3.5rem] min-h-[500px] flex items-center justify-center overflow-hidden border-white/5 shadow-2xl relative">
          {loading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-4 border-white/5 border-t-pink-500 rounded-full animate-spin"></div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Neural Forge Active...</p>
            </div>
          ) : output ? (
            output.type === 'img' ? (
              <img src={output.url} className="w-full h-full object-contain" />
            ) : (
              <video src={output.url} className="w-full h-full object-contain" controls autoPlay loop />
            )
          ) : (
            <div className="text-slate-700 font-mono text-xs uppercase tracking-[0.5em] select-none">Studio Output Ready</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeuralStudio;
