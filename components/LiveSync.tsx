
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../geminiService.ts';

const LiveSync: React.FC = () => {
  const [active, setActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    // Use sessionPromise to avoid stale closures and race conditions as per guidelines.
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
            
            // Fix: Solely rely on sessionPromise to send data to avoid stale closures.
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ 
                media: { 
                  data: encode(new Uint8Array(int16.buffer)), 
                  mimeType: 'audio/pcm;rate=16000' 
                } 
              });
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
          setActive(true);
        },
        onmessage: async (msg) => {
          const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const buffer = await decodeAudioData(decode(audio), outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          if (msg.serverContent?.outputTranscription) {
            setTranscripts(prev => [...prev.slice(-4), msg.serverContent.outputTranscription.text]);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => {
              try { s.stop(); } catch (err) {}
            });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: "You are a friendly, fast-talking humor assistant in a real-time voice chat."
      }
    });
    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    sessionRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setActive(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-700">
      <div className="text-center">
        <h2 className="text-5xl font-display font-black mb-2">Live <span className="text-emerald-400">Sync</span></h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Low-Latency Neural Voice</p>
      </div>

      <div className="relative">
        <div className={`w-64 h-64 rounded-full glass border-white/10 flex items-center justify-center transition-all duration-1000 ${active ? 'scale-110 border-emerald-500/50 shadow-[0_0_80px_rgba(52,211,153,0.2)]' : ''}`}>
          {active ? (
            <div className="flex gap-1 items-end h-16">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          ) : (
            <div className="text-4xl">🎙️</div>
          )}
        </div>
        
        {active && (
          <div className="absolute -top-12 -right-12 w-24 h-24 glass rounded-full flex items-center justify-center animate-bounce border-emerald-500/20">
            <span className="text-[10px] font-black uppercase text-emerald-400">Live</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-lg glass p-8 rounded-[2rem] border-white/5 min-h-[120px] text-center">
        {transcripts.length > 0 ? (
          <p className="text-lg text-slate-300 italic">"...{transcripts.join(' ')}"</p>
        ) : (
          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">{active ? 'Listening for signal...' : 'Ready for Neural Link'}</p>
        )}
      </div>

      <button
        onClick={active ? stopSession : startSession}
        className={`px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl ${active ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-emerald-500 text-black hover:scale-105 active:scale-95'}`}
      >
        {active ? 'Disconnect Session' : 'Establish Neural Link'}
      </button>
    </div>
  );
};

export default LiveSync;
