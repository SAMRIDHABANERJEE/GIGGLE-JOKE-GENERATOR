export interface Joke {
  setup: string;
  punchline: string;
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
  error: string | null;
  vibe: Vibe;
}