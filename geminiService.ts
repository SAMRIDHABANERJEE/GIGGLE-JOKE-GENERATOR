import { GoogleGenAI, Type } from "@google/genai";
import { Joke, Vibe } from "./types.ts";

export const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  // Use a lazy check for the API Key
  const apiKey = (window as any).process?.env?.API_KEY;
  
  if (!apiKey) {
    throw new Error("Neural link failed: API Key not detected in system environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';
  
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "a sharp-witted intellectual",
    [Vibe.ABSURD]: "a surrealist philosopher",
    [Vibe.WHOLESOME]: "a warm, friendly mentor",
    [Vibe.WITTY]: "a quick-fire comedian",
    [Vibe.SURPRISE]: "a chaotic humor-bot"
  };

  const selectedVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Execute humor protocol: style=${selectedVibe}.`,
      config: {
        systemInstruction: `You are ${personaMap[vibe]}. Create a fresh 2-line joke in JSON format with 'setup' and 'punchline'.`,
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

    const text = response.text;
    if (!text) throw new Error("Null response from core.");
    
    return JSON.parse(text) as Joke;
  } catch (error) {
    console.error("Gemini Core Error:", error);
    throw new Error("Humor matrix destabilized. Please retry initialization.");
  }
};