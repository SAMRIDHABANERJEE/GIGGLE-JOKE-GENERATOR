
import { GoogleGenAI, Type } from "@google/genai";
import { Joke, Vibe } from "./types"; // Removed .ts

export const generateJoke = async (vibe: Vibe): Promise<Joke> => {
  // CRITICAL: Always create a new GoogleGenAI instance right before making an API call 
  // to ensure it uses the most up-to-date API key from the environment or dialog.
  const apiKey = (window as any).process?.env?.API_KEY;
  
  if (!apiKey) {
    throw new Error("Neural link failed: API Key not detected in system environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  // Upgraded to 'gemini-3-pro-preview' for more complex reasoning and better joke quality.
  const model = 'gemini-3-pro-preview';
  
  const personaMap: Record<string, string> = {
    [Vibe.CLEVER]: "a sharp-witted intellectual",
    [Vibe.ABSURD]: "a surrealist philosopher who enjoys non-sequiturs",
    [Vibe.WHOLESOME]: "a warm, kind mentor whose jokes feel like a hug",
    [Vibe.WITTY]: "a quick-fire observational comedian",
    [Vibe.SURPRISE]: "a chaotic, high-energy humor algorithm"
  };

  const selectedVibe = vibe === Vibe.SURPRISE 
    ? [Vibe.CLEVER, Vibe.ABSURD, Vibe.WHOLESOME, Vibe.WITTY][Math.floor(Math.random() * 4)]
    : vibe;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Execute humor protocol: style=${selectedVibe}. Create a fresh, high-quality 2-line joke.`,
      config: {
        systemInstruction: `You are ${personaMap[vibe]}. Your task is to generate a unique, high-quality 2-line joke in JSON format. The 'setup' should build expectation, and the 'punchline' should be unexpected and clever. Avoid generic or overused puns.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setup: { 
              type: Type.STRING,
              description: "The first line or setup of the joke."
            },
            punchline: { 
              type: Type.STRING,
              description: "The second line or the punchline of the joke."
            }
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
    throw new Error("Humor matrix destabilized. Please check your neural link (API Key) and retry.");
  }
};