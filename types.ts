
export interface Joke {
  setup: string;
  punchline: string;
  explanation?: string;
}

export enum Vibe {
  CLEVER = 'clever',
  ABSURD = 'absurd',
  WHOLESOME = 'wholesome',
  WITTY = 'witty',
  SURPRISE = 'surprise'
}

export interface GeneratorState {
  joke: Joke | null;
  loading: boolean;
  visualLoading: boolean;
  audioLoading: boolean;
  explaining: boolean;
  error: string | null;
  vibe: Vibe;
  topic: string;
  isFirstJoke: boolean;
  imageUrl: string | null;
  audioBuffer: AudioBuffer | null;
}
