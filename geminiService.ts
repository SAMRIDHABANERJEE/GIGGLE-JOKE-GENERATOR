
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Vibe, Joke, ImageConfig } from "./types.ts";

// Helper to create a fresh AI instance with the latest key from the process env
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Joke Services ---
export const generateJoke = async (vibe: Vibe, topic: string): Promise<Joke> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Style: ${vibe}. Topic: ${topic || 'random'}.`,
    config: {
      systemInstruction: "Create a unique 2-line joke. Return JSON with 'setup' and 'punchline'.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          setup: { type: Type.STRING },
          punchline: { type: Type.STRING }
        },
        required: ["setup", "punchline"]
      }
    }
  });
  return JSON.parse(response.text) as Joke;
};

export const generateJokeVisual = async (joke: Joke): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: `Funny, artistic, high-quality illustration: Setup: ${joke.setup} Punchline: ${joke.punchline}. Neon cyber-noir style.`,
    config: { imageConfig: { aspectRatio: '16:9' } }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part) throw new Error("Visual projection failed.");
  return `data:image/png;base64,${part.inlineData.data}`;
};

// --- Image Generation & Editing ---
export const generateProImage = async (prompt: string, config: ImageConfig): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [{ text: prompt }],
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: config.size
      }
    }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (!part) throw new Error("Image part missing");
  return `data:image/png;base64,${part.inlineData.data}`;
};

export const editImage = async (base64: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (!part) throw new Error("Edited image part missing");
  return `data:image/png;base64,${part.inlineData.data}`;
};

// --- Video Generation ---
export const generateVeoVideo = async (prompt: string, imageBase64?: string): Promise<string> => {
  const ai = getAI();
  const op = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'An atmospheric sequence based on the input',
    image: imageBase64 ? { imageBytes: imageBase64.split(',')[1], mimeType: 'image/png' } : undefined,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });
  
  let operation = op;
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

// --- Chat & Intelligence ---
export const neuralChat = async (
  message: string, 
  history: any[], 
  options: { thinking?: boolean, search?: boolean, maps?: boolean, location?: any, media?: {data: string, type: string} }
) => {
  const ai = getAI();
  const model = options.thinking ? 'gemini-3-pro-preview' : (options.maps ? 'gemini-2.5-flash' : 'gemini-3-flash-preview');
  
  const tools: any[] = [];
  if (options.search) tools.push({ googleSearch: {} });
  if (options.maps) tools.push({ googleMaps: {} });

  const parts: any[] = [];
  if (options.media) {
    parts.push({ inlineData: { data: options.media.data, mimeType: options.media.type } });
  }
  parts.push({ text: message });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      tools,
      toolConfig: options.maps && options.location ? {
        retrievalConfig: { latLng: options.location }
      } : undefined,
      thinkingConfig: options.thinking ? { thinkingBudget: 32768 } : undefined
    }
  });

  return {
    text: response.text,
    grounding: response.candidates[0].groundingMetadata?.groundingChunks || []
  };
};

// --- Audio Utilities ---
export function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
