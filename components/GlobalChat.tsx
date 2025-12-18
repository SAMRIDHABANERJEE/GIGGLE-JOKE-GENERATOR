
import React, { useState, useRef } from 'react';
import { neuralChat } from '../geminiService.ts';
import { ChatMessage } from '../types.ts';

const GlobalChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ thinking: false, search: true, maps: false });
  const [media, setMedia] = useState<{data: string, type: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() && !media) return;
    const userMsg: ChatMessage = { role: 'user', text: input, image: media?.type.includes('image') ? media.data : undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let location;
    if (options.maps) {
      const pos: any = await new Promise(res => navigator.geolocation.getCurrentPosition(res, () => res(null)));
      if (pos) location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    }

    try {
      const res = await neuralChat(input, messages, { ...options, location, media: media || undefined });
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: res.text, 
        isThinking: options.thinking,
        groundingUrls: res.grounding.map((c: any) => ({
          title: c.web?.title || c.maps?.title || 'Source',
          uri: c.web?.uri || c.maps?.uri || '#'
        }))
      };
      setMessages(prev => [...prev, modelMsg]);
      setMedia(null);
    } catch (e) { console.error(e); }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
  };

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMedia({ data: (reader.result as string).split(',')[1], type: file.type });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
      <header className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-3xl font-display font-black">Neural <span className="text-cyan-400">Chat</span></h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Global Intelligence Hub</p>
        </div>
        <div className="flex gap-2">
          {['thinking', 'search', 'maps'].map(opt => (
            <button
              key={opt}
              onClick={() => setOptions({...options, [opt]: !options[opt as keyof typeof options]})}
              className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${options[opt as keyof typeof options] ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-500'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 glass rounded-[2.5rem] overflow-y-auto p-8 space-y-6 border-white/5 shadow-inner custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-30 select-none">
            <div className="text-6xl mb-4">🌌</div>
            <p className="font-mono text-xs uppercase tracking-[0.5em]">Synchronizing Context...</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-6 rounded-[2rem] ${m.role === 'user' ? 'bg-white text-black' : 'glass border-white/5 text-slate-100'}`}>
              {m.image && <img src={`data:image/png;base64,${m.image}`} className="rounded-xl mb-4 max-h-60" />}
              {m.isThinking && <div className="mb-2 text-[9px] text-cyan-500 font-mono tracking-widest uppercase animate-pulse">Deep Reasoning Active</div>}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              {m.groundingUrls && m.groundingUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {m.groundingUrls.map((u, j) => (
                    <a key={j} href={u.uri} target="_blank" className="text-[10px] px-2 py-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors text-cyan-400">
                      {u.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start animate-pulse"><div className="w-12 h-6 glass rounded-full"></div></div>}
      </div>

      <div className="glass p-4 rounded-[2.5rem] flex items-center gap-4 border-white/5">
        <label className="cursor-pointer p-3 hover:bg-white/5 rounded-full transition-colors text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <input type="file" className="hidden" accept="image/*,video/*" onChange={handleMedia} />
          {media && <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500 rounded-full"></div>}
        </label>
        <input
          className="flex-1 bg-transparent px-2 text-sm outline-none"
          placeholder="Ask anything... (Search, Maps, Thinking enabled)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-4 bg-cyan-600 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-600/20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  );
};

export default GlobalChat;
