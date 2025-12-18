
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Joke, Vibe } from "./types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJoke = async (vibe: Vibe, topic: string): Promise<Joke> => {
  const ai = getAI();
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "a sharp-witted intellectual",
    [Vibe.ABSURD]: "a surrealist philosopher",
    [Vibe.WHOLESOME]: "a warm, friendly mentor",
    [Vibe.WITTY]: "a quick-fire comedian",
    [Vibe.SURPRISE]: "a chaotic humor-bot"
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Style: ${vibe}. Topic: ${topic || 'random'}.`,
      config: {
        systemInstruction: `You are ${personaMap[vibe]}. Create a unique 2-line joke. Topic focus: ${topic || 'anything'}. Return JSON with 'setup' and 'punchline'.`,
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
  } catch (error) {
    throw new Error("Humor matrix destabilized. Re-sync required.");
  }
};

export const generateJokeVisual = async (joke: Joke): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `A stylized, cyber-noir neon illustration depicting: ${joke.setup} ${joke.punchline}. Cinematic lighting, digital glitch aesthetic, high detail.`,
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part) throw new Error("Visual projection failed.");
    return `data:image/png;base64,${part.inlineData.data}`;
  } catch (error) {
    console.error("Image Error:", error);
    throw error;
  }
};

export const generateJokeSpeech = async (text: string, vibe: Vibe): Promise<string> => {
  const ai = getAI();
  const voiceMap: Record<string, string> = {
    [Vibe.CLEVER]: 'Kore',
    [Vibe.ABSURD]: 'Puck',
    [Vibe.WHOLESOME]: 'Fenrir',
    [Vibe.WITTY]: 'Zephyr',
    [Vibe.SURPRISE]: 'Charon'
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceMap[vibe] || 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  } catch (error) {
    throw error;
  }
};

export const explainJoke = async (joke: Joke): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Explain the humor and linguistic structure of this joke: "${joke.setup} ... ${joke.punchline}". Be sophisticated and slightly analytical.`,
    });
    return response.text || "Humor is subjective; the matrix cannot compute the logic.";
  } catch (error) {
    return "Deconstruction failed. Logical paradox detected.";
  }
};
