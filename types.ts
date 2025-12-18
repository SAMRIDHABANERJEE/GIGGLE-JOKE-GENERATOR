
export enum Vibe {
  CLEVER = 'clever',
  ABSURD = 'absurd',
  WHOLESOME = 'wholesome',
  WITTY = 'witty',
  SURPRISE = 'surprise'
}

export interface Joke {
  setup: string;
  punchline: string;
  explanation?: string;
}

export type AppMode = 'JOKE_LAB' | 'NEURAL_STUDIO' | 'GLOBAL_CHAT' | 'LIVE_SYNC';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  video?: string;
  groundingUrls?: { title: string; uri: string }[];
  isThinking?: boolean;
}

export interface ImageConfig {
  size: '1K' | '2K' | '4K';
  aspectRatio: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
}
